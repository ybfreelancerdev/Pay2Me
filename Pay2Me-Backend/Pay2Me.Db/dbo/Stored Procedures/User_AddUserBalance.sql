
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_AddUserBalance @JsonData=N'{"UserId":116,"Amount":"2200"}',@LogInUserId='1'
-- =============================================
CREATE PROCEDURE [dbo].[User_AddUserBalance]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @RoleId INT,
			@UserId INT,
			@OTP VARCHAR(15),
			@Balance MONEY,
			@Amount MONEY,
			@referenceId VARCHAR(200),
			@Username VARCHAR(50),
			@RefId varchar(7),
			@PartyOwner INT = 0,
			@PartyName VARCHAR(50);

	DROP TABLE IF EXISTS #PartyCommission
	CREATE TABLE #PartyCommission
	(
		Id			INT             NOT NULL,
		Commission  DECIMAL(5,2)    NULL,
		Amount      MONEY			NULL,
		Balance		MONEY			NULL,
		IsParty     BIT             NOT NULL,
		TTypeId		INT				NOT NULL
	);


	SET @referenceId = NEWID();

	SELECT DISTINCT TOP 1
				@UserId = JSON_VALUE(@JsonData, '$.UserId'),
				@Amount = JSON_VALUE(@JsonData, '$.Amount')
		FROM OPENJSON(@JsonData)

	(SELECT @Balance = Balance, @Username = Username, @PartyOwner = PartyOwner FROM Users WITH (NOLOCK) WHERE Id = @UserId AND IsDelete = 0)
	(SELECT @RoleId = RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId AND IsDelete = 0)

	IF(@RoleId = 1)
	BEGIN
		IF Exists(
					Select Top 1 1 
						From Users WITH (NOLOCK) 
						Where Id = @UserId
							AND IsDelete = 0)
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

				-- insert all the parties based on user 
				INSERT INTO #PartyCommission (Id, Commission, Amount, Balance, IsParty, TTypeId)
				SELECT 
						pc.PartyId,
						pc.Commission,
						0,
						ISNULL(u.Balance, 0),
						1,
						3
				FROM PartyCommission pc WITH(NOLOCK)
				INNER JOIN Users u WITH (NOLOCK)
						ON u.Id = pc.PartyId
				WHERE pc.UserId = @UserId

				-- update the amount based on commission
				IF EXISTS (SELECT 1 FROM #PartyCommission)
				BEGIN
					UPDATE #PartyCommission
					SET Amount = @Amount * (Commission / 100.0);
				END

				-- update the amount after commission of user
				DECLARE @TotalCommission DECIMAL(18,2) = 0;

				IF EXISTS (SELECT 1 FROM #PartyCommission)
				BEGIN
					SELECT @TotalCommission = SUM(Amount)
					FROM #PartyCommission;
				END

				INSERT INTO #PartyCommission (Id, Commission, Amount, Balance, IsParty, TTypeId)
				VALUES (@UserId, 0, @Amount - @TotalCommission, @Balance, 0, 1)

				-- insert transaction entry for party owner
				SET @PartyName = (SELECT TOP 1 Username FROM Users WHERE Id = @PartyOwner);
				
				IF (ISNULL(@PartyName, '') <> '')
				BEGIN
					INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Descriptions)
					SELECT TOP 1
							1,
							@OTP,
							@RefId,
							@PartyOwner,
							2,
							2,
							0,
							@Amount,
							(ISNULL(u.Balance, 0) - @Amount),
							GETUTCDATE(),
							CONCAT('Balance add to ', @UserName)
						FROM Users u
					WHERE u.Id = @PartyOwner
				END

				-- insert transaction entry for user and commission parties
				INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Descriptions)
				SELECT 
						pc.TTypeId,
						@OTP,
						@RefId,
						pc.Id,
						2,
						2,
						IIF(pc.IsParty = 0, (pc.Amount + @TotalCommission), (pc.Amount)),
						0,
						IIF(pc.IsParty = 0, (pc.Balance + pc.Amount + @TotalCommission), (IIF(@PartyOwner = pc.Id, pc.Balance - @Amount, pc.Balance) + pc.Amount)),
						GETUTCDATE(),
						IIF(pc.IsParty = 0, 
							IIF(ISNULL(@PartyName, '') <> '', CONCAT('Received balance from ', ISNULL(@PartyName, '')), 'Received balance'), 
							CONCAT('Received charges of balance add from ', @UserName)
						)
					FROM #PartyCommission pc
					ORDER BY pc.Amount DESC

				-- Insert transaction entry for user only
				IF EXISTS (SELECT 1 FROM #PartyCommission WHERE IsParty = 1)
				BEGIN
					INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Descriptions, IsUserCommissionEntry)
					SELECT 
							3,
							@OTP,
							@RefId,
							@UserId,
							2,
							2,
							0,
							@TotalCommission,
							(pc.Balance + @Amount) - @TotalCommission,
							GETUTCDATE(),
							'Charges deducted for balance add',
							1
						FROM #PartyCommission pc
						WHERE pc.IsParty = 0
						GROUP BY pc.Amount, pc.Balance
				END


				UPDATE u
					SET u.Balance = (pc.Balance + pc.Amount)
				FROM Users u
				INNER JOIN #PartyCommission PC
					ON U.Id = pc.Id;

				IF (ISNULL(@PartyOwner, 0) <> 0)
				BEGIN
					UPDATE u
						SET u.Balance = (u.Balance - @Amount)
					FROM Users u
					WHERE u.Id = @PartyOwner
				END


				Select TOP 1 'Balance added successfully.' AS FLAG, 
						   1 AS Success
	
		END
		ELSE
		BEGIN

				Select TOP 1 'User not found!' AS FLAG, 
						   0 AS Success
		END
	END
	ELSE
	BEGIN
		SELECT TOP 1 'Your user is not able to add balance in user account!' AS FLAG, 0 AS Success
	END
END
