
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_AddTransaction '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_AddTransaction]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @BeneficiaryId INT,
			@Amount MONEY,
			@Balance MONEY,
			@OTP VARCHAR(15),
			@settingJSON VARCHAR(MAX),
			@MinValue MONEY,
			@MAXValue MONEY,
			@referenceId VARCHAR(200),
			@PreviousAmount MONEY  = 0,
			@PreviousAmountDt INT = 0,
			@PreviousBeneficiaryId INT = 0,
			@RefId varchar(7);

	SET @referenceId = NEWID();

	SELECT DISTINCT TOP 1
				@BeneficiaryId = JSON_VALUE(@JsonData, '$.BeneficiaryId'),
				@Amount = JSON_VALUE(@JsonData, '$.Amount')
		FROM OPENJSON(@JsonData)
	
	-- check and get user transaction limit amounts
	IF EXISTS(SELECT TOP 1 1 FROM Users WHERE Id = @LogInUserId AND ISNULL(Limit, '') <> '')
	BEGIN
		SET @settingJSON = (SELECT Limit FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId)

		SELECT DISTINCT TOP 1
					@MinValue = JSON_VALUE(@settingJSON, '$.minValue'),
					@MAXValue = JSON_VALUE(@settingJSON, '$.maxValue')
			FROM OPENJSON(@settingJSON)
	END
	ELSE
	BEGIN
		-- get global and set transaction limit
		SET @settingJSON = (SELECT KeyValue FROM Settings WITH (NOLOCK) WHERE KeyName = 'MinMaxValue' AND IsEnable = 1)

		SELECT DISTINCT TOP 1
					@MinValue = JSON_VALUE(@settingJSON, '$.minValue'),
					@MAXValue = JSON_VALUE(@settingJSON, '$.maxValue')
			FROM OPENJSON(@settingJSON)
	END

	IF((@Amount BETWEEN @MinValue and @MAXValue) OR (@MinValue is null and @MAXValue is null))
	BEGIN

		(Select @Balance = Balance from Users WITH (NOLOCK) WHERE Id = @LogInUserId AND IsDelete = 0)

		IF EXISTS(SELECT TOP 1 1 FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId)
		BEGIN

			IF EXISTS (SELECT TOP 1 1 FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId AND Balance >= @Amount)
			BEGIN
				
				SELECT TOP 1 
					@PreviousAmount = t.DAmount, 
					@PreviousAmountDt = (datediff(minute, t.CreatedDate, DATEADD(minute, 1, GETUTCDATE()))),
					@PreviousBeneficiaryId = b.Id
						FROM Transactions t WITH (NOLOCK) 
						INNER JOIN TransactionLogs tl WITH (NOLOCK) ON tl.UserId = @LogInUserId AND tl.TransactionId = t.TransactionId
						INNER JOIN Beneficiary b WITH (NOLOCK) ON b.UserId = @LogInUserId AND b.AccountId = tl.AccountId
						WHERE t.UserId = @LogInUserId
						ORDER BY t.CreatedDate DESC

				IF (@PreviousAmount = @Amount AND @PreviousAmountDt <= 5 AND @PreviousBeneficiaryId = @BeneficiaryId)
				BEGIN

					Select TOP 1 'You can send the same amount after '+ CAST(6 - @PreviousAmountDt AS VARCHAR(10))+' minutes!' AS FLAG,
					0 AS Success

				END
				ELSE
				BEGIN
					SET @OTP = convert(numeric(14,0),rand() * 89999999999999) + 10000000000000
					IF(LEN(@OTP) > 14)
					BEGIN
						SET @OTP = SUBSTRING(@OTP, 1, 14)
					END

					SET @RefId = CONVERT(nvarchar(6),LEFT(REPLACE(NEWID(),'-',''),6))
					IF(LEN(@RefId) > 6)
					BEGIN
						SET @RefId = SUBSTRING(@RefId, 1, 6)
					END

					-- user entry
					INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, RequestRead)
					VALUES (4, @OTP, @RefId, @LogInUserId, 1, 1, 0, @Amount, (@Balance - @Amount), GETUTCDATE(), 0)

					-- party Ower entry
					--INSERT INTO Transactions(TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, RequestRead)
					--SELECT TOP 1
					--		@OTP,
					--		@RefId,
					--		@PartyOwner,
					--		1,
					--		1,
					--		@Amount,
					--		0,
					--		(u.Balance + @Amount),
					--		GETUTCDATE(),
					--		0
					--	FROM Users u
					--WHERE Id = @PartyOwner
					--VALUES (@OTP, @RefId, @PartyOwner, 1, 1, @Amount, 0, (@Balance - @Amount), GETUTCDATE(), 0)

					INSERT INTO TransactionLogs(TransactionId, AccountId, UserId, BankName, AccountNo, AccountHolderName, IFSCCode)
					SELECT @OTP, b.AccountId, b.UserId, b.BankName, b.AccountNo, b.AccountHolderName, b.IFSCCode FROM Beneficiary b WHERE b.Id = @BeneficiaryId

					UPDATE Users SET Balance = (Balance - @Amount) WHERE Id = @LogInUserId

					Select TOP 1 'Transaction successful' AS FLAG, 
						1 AS Success,
						@OTP As TransactionId,
						BankName,
						AccountNo,
						AccountHolderName,
						IFSCCode,
						@Amount As Amount,
						CAST(SWITCHOFFSET(GETUTCDATE(), '+05:30') AS DATETIME) AS CreatedDate
					FROM Beneficiary WITH (NOLOCK)
						WHERE Id = @BeneficiaryId
				END
			END
			ELSE
			BEGIN
				Select TOP 1 'You have no balance to send money!' AS FLAG, 
					0 AS Success
			END

		END
		ELSE
		BEGIN
		
			Select TOP 1 'Password does not matched.!' AS FLAG, 
				0 AS Success

		END
	END
	ELSE
	BEGIN
		SELECT TOP 1 'Only amount between Rs '+CAST(@MinValue AS VARCHAR)+' and Rs '+CAST(@MAXValue AS VARCHAR)+' will be accepted!' AS FLAG,
					0 AS Success
	END
END
