-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Transactions_AddHawalaEntry '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_AddHawalaEntry]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @RoleId INT,
			@prefix VARCHAR(10) = 'HVL',
			@nextNumber INT = 0,
			@newReferenceId VARCHAR(20) = '',
			@OTP VARCHAR(15),
			@FromId INT = 0,
			@ToId INT = 0,
			@Amount MONEY = 0,
			@referenceId VARCHAR(200) = '',
			@RefId varchar(7),
			@Remarks VARCHAR(500) = '';

	SET @referenceId = NEWID();

	SELECT DISTINCT TOP 1
				@FromId = JSON_VALUE(@JsonData, '$.FromId'),
				@ToId = JSON_VALUE(@JsonData, '$.ToId'),
				@Amount = JSON_VALUE(@JsonData, '$.Amount'),
				@Remarks = JSON_VALUE(@JsonData, '$.Remarks')
		FROM OPENJSON(@JsonData)

	(SELECT @RoleId = RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId AND IsDelete = 0)
	(SELECT @nextNumber = ISNULL(MAX(CAST(SUBSTRING(TransactionId, 4, LEN(TransactionId)) AS INT)), 0) + 1
		FROM Transactions WHERE TTypeId = 5)

	SET @newReferenceId = @prefix + RIGHT('0000' + CAST(@nextNumber AS VARCHAR(4)), 4);

	IF(@RoleId = 1)
	BEGIN
			DECLARE @FromUser VARCHAR(50) = '', @ToUser VARCHAR(50) = '';
			
			SET @FromUser = (SELECT TOP 1 Username FROM Users WHERE Id = @FromId)
			SET @ToUser = (SELECT TOP 1 Username FROM Users WHERE Id = @ToId)

			SET @referenceId = CONVERT(nvarchar(6),LEFT(REPLACE(NEWID(),'-',''),6))
			IF(LEN(@referenceId) > 6)
			BEGIN
				SET @referenceId = SUBSTRING(@referenceId, 1, 6)
			END

			IF Exists(SELECT TOP 1 1 
						FROM Users WHERE Id = @FromId 
							AND (
							(RoleId = 2 AND Balance >= @Amount)
							OR (RoleId <> 2)
						  )
					)
			BEGIN
				-- hawala from entry
				INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, Descriptions, Remarks, CreatedDate, IsDeleted, IsSettle)
				VALUES (
						5,
						@newReferenceId,
						@referenceId,
						@FromId,
						2,
						1,
						0,
						@Amount,
						(SELECT TOP 1 (Balance - @Amount) FROM Users WHERE Id = @FromId),
						'H - '+ @ToUser+' - ' + @Remarks,
						@Remarks,
						GETUTCDATE(),
						0,
						0
					)

				-- hawala to entry
				INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, Descriptions, Remarks, CreatedDate, IsDeleted, IsSettle)
				VALUES (
						5,
						@newReferenceId,
						@referenceId,
						@ToId,
						2,
						2,
						@Amount,
						0,
						(SELECT TOP 1 (Balance + @Amount) FROM Users WHERE Id = @ToId),
						--'Hawala transfer of '+ @FromUser,
						'H - '+ @FromUser +' - ' + @Remarks,
						@Remarks,
						GETUTCDATE(),
						0,
						0
					)

				UPDATE Users
					SET Balance = (Balance - @Amount)
				WHERE Id = @FromId

				UPDATE Users
					SET Balance = (Balance + @Amount)
				WHERE Id = @ToId

				Select TOP 1 'Hawala entry added successfully.' AS FLAG, 
							   1 AS Success
			END
			ELSE
			BEGIN
				Select TOP 1 'User have not enough balance.!' AS FLAG, 
							   0 AS Success
			END
	END
	ELSE
	BEGIN
		SELECT TOP 1 'Your are not able to add hawala entry!' AS FLAG, 0 AS Success
	END
END
