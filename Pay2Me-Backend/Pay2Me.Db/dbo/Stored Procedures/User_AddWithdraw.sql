
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_AddWithdraw '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[User_AddWithdraw]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @UserId INT,
			@Amount MONEY,
			@Balance MONEY,
			@OTP VARCHAR(15),
			@Remark VARCHAR(MAX),
			@referenceId VARCHAR(200),
			@RefId varchar(7);

	SET @referenceId = NEWID();
			--@Balance MONEY = 0;

	SELECT DISTINCT TOP 1
				@UserId = JSON_VALUE(@JsonData, '$.UserId'),
				@Amount = JSON_VALUE(@JsonData, '$.Amount'),
				@Remark = JSON_VALUE(@JsonData, '$.Remark')
		FROM OPENJSON(@JsonData)


	IF NOT EXISTS(SELECT TOP 1 1
					FROM Transactions 
					WHERE UserId = @UserId
						AND PaymentStatusId = 1)
	BEGIN

		IF EXISTS (SELECT TOP 1 1 FROM Users WITH (NOLOCK) WHERE Id = @UserId AND Balance >= @Amount)
		BEGIN

			SET @Balance = (Select Balance from Users WITH (NOLOCK) WHERE Id = @UserId AND IsDelete = 0)

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


			INSERT INTO Transactions(TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Remarks)
			VALUES (@OTP, @RefId, @UserId, 5, 1, 0, @Amount, (@Balance - @Amount), GETUTCDATE(), @Remark)

			UPDATE Users SET Balance = (Balance - @Amount) WHERE Id = @UserId

			Select TOP 1 'Withdraw successful' AS FLAG, 
				1 AS Success
		END
		ELSE
		BEGIN
			Select TOP 1 'User does not have sufficient balance to withdraw.' AS FLAG, 
				0 AS Success
		END

	END
	ELSE
	BEGIN

			Select TOP 1 'Please do the action for pending request.' AS FLAG, 
					   0 AS Success
	END
END
