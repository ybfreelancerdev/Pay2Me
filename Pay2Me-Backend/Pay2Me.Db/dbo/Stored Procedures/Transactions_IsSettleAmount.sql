
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC [Transactions_IsSettleAmount] 1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_IsSettleAmount]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @TransactionId VARCHAR(50),
			@Id INT,
			@UserId INT,
			@RoleId INT = 0;

	SELECT DISTINCT TOP 1
				@TransactionId = JSON_VALUE(@JsonData, '$.TransactionId'),
				@Id = JSON_VALUE(@JsonData, '$.Id'),
				@UserId = JSON_VALUE(@JsonData, '$.UserId')
		FROM OPENJSON(@JsonData)


		IF EXISTS(SELECT TOP 1 1
			FROM Transactions WITH (NOLOCK)
				WHERE TransactionId = @TransactionId
					AND Id = @Id)
		BEGIN
			UPDATE Transactions
				SET IsSettle = 1
				WHERE --TransactionId = @TransactionId
					UserId = @UserId
					AND Id <= @Id

			Select TOP 1 'Amount settled successfully.!' AS FLAG, 
				1 AS Success
		END
		ELSE
		BEGIN
			Select TOP 1 'Oops, something went wrong. Try again later.!' AS FLAG, 
				0 AS Success
		END
END
