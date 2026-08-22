
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Auth_RequestTransaction @JsonData=N'{ Amount = 200, BankName = ICICI Bank, AccountNo = 02030723600, AccountHolderName = Yash Patel, IFSCCode = ICICI2002W }',@LogInUserId='2'
-- =============================================
CREATE PROCEDURE [dbo].[Auth_RequestTransaction]
	-- Add the parameters for the stored procedure here
	@Amount MONEY,
	@BankName VARCHAR(50),
	@AccountNo VARCHAR(50),
	@AccountHolderName VARCHAR(50),
	@IFSCCode VARCHAR(50),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @Balance MONEY,
			@OTP VARCHAR(15),
			@settingJSON VARCHAR(MAX),
			@MinValue MONEY,
			@MAXValue MONEY,
			@referenceId VARCHAR(200),
			@PreviousAmount MONEY  = 0,
			@PreviousAmountDt INT = 0,
			@RefId varchar(7);

	SET @referenceId = NEWID();

	--SELECT DISTINCT TOP 1
	--			@Amount = JSON_VALUE(@JsonData, '$.Amount'),
	--			@BankName = JSON_VALUE(@JsonData, '$.BankName'),
	--			@AccountNo = JSON_VALUE(@JsonData, '$.AccountNo'),
	--			@AccountHolderName = JSON_VALUE(@JsonData, '$.AccountHolderName'),
	--			@IFSCCode = JSON_VALUE(@JsonData, '$.IFSCCode')
	--	FROM OPENJSON(@JsonData)

	SET @settingJSON = (SELECT KeyValue FROM Settings WITH (NOLOCK) WHERE KeyName = 'MinMaxValue' AND IsEnable = 1)

	SELECT DISTINCT TOP 1
				@MinValue = JSON_VALUE(@settingJSON, '$.minValue'),
				@MAXValue = JSON_VALUE(@settingJSON, '$.maxValue')
		FROM OPENJSON(@settingJSON)

	IF((@Amount BETWEEN @MinValue and @MAXValue) OR (@MinValue is null and @MAXValue is null))
	BEGIN
		SET @Balance = (Select Balance from Users WITH (NOLOCK) WHERE Id = @LogInUserId AND IsDelete = 0)

		IF EXISTS(SELECT TOP 1 1 FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId)
		BEGIN

			IF EXISTS (SELECT TOP 1 1 FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId AND Balance >= @Amount)
			BEGIN
				
				SELECT TOP 1 
					@PreviousAmount = DAmount, @PreviousAmountDt = (datediff(minute, CreatedDate, DATEADD(minute, 1, GETUTCDATE())))
						FROM Transactions WITH (NOLOCK) 
						WHERE UserId = @LogInUserId
						ORDER BY CreatedDate DESC

				IF (@PreviousAmount = @Amount AND @PreviousAmountDt <= 5)
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

					SET @RefId = CAST((ABS(CHECKSUM(@referenceId))%10) AS VARCHAR(1)) + 
							CHAR(ASCII('A')+(ABS(CHECKSUM(@referenceId))%25)) +
							CHAR(ASCII('A')+(ABS(CHECKSUM(@referenceId))%25)) +
							LEFT(@referenceId,3)
					IF(LEN(@RefId) > 6)
					BEGIN
						SET @RefId = SUBSTRING(@RefId, 1, 6)
					END
					INSERT INTO Transactions(TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, RequestRead)
					VALUES (@OTP, @RefId, @LogInUserId, 1, 1, 0, @Amount, (@Balance - @Amount), GETUTCDATE(), 0)

					INSERT INTO TransactionLogs(TransactionId, UserId, BankName, AccountNo, AccountHolderName, IFSCCode)
					VALUES (@OTP, @LogInUserId, @BankName, @AccountNo, @AccountHolderName, @IFSCCode)

					UPDATE Users SET Balance = (Balance - @Amount) WHERE Id = @LogInUserId

					Select TOP 1 'Transaction successful' AS FLAG, 
						1 AS Success,
						@OTP As TransactionId,
						@BankName,
						@AccountNo,
						@AccountHolderName,
						@IFSCCode,
						@Amount As Amount,
						CAST(SWITCHOFFSET(GETUTCDATE(), '+05:30') AS DATETIME) AS CreatedDate
					
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
