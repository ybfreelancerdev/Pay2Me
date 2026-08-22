
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC [Hawala_DeleteHawalaEntry] 1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_DeleteHawalaEntry]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @TransactionId VARCHAR(50),
			@Code VARCHAR(10),
			@RoleId INT = 0;

	SELECT DISTINCT TOP 1
				@TransactionId = JSON_VALUE(@JsonData, '$.TransactionId'),
				@Code = JSON_VALUE(@JsonData, '$.Code')
		FROM OPENJSON(@JsonData)

	(SELECT @RoleId = RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId)

	IF(@RoleId = 1)
	BEGIN
			IF(@Code = 'DELETE')
			BEGIN
				
				IF EXISTS(SELECT 
								TOP 1 1
							FROM Transactions t
							INNER JOIN Users u
								ON u.Id = t.UserId
							WHERE t.TransactionStatuId = 2
								AND t.TransactionId = @TransactionId
								AND (
									(u.RoleId = 2 AND u.Balance >= t.CAmount)   -- For role 2, must check balance
									OR (u.RoleId <> 2)                      -- For other roles, skip balance check
								  ))
				BEGIN

					IF EXISTS(SELECT TOP 1 1
						FROM Transactions WITH (NOLOCK)
							WHERE TransactionId = @TransactionId)
					BEGIN

						UPDATE u
								SET u.Balance = CASE
													WHEN t.TransactionStatuId = 1
													THEN (u.Balance + t.net_amount)
													WHEN t.TransactionStatuId = 2
													THEN (u.Balance - t.net_amount)
													ELSE u.Balance
												END
							FROM Users u
							JOIN (
								SELECT 
									TransactionId,
									UserId,
									TransactionStatuId,
									CASE 
										WHEN TransactionStatuId = 1 THEN DAmount
										WHEN TransactionStatuId = 2 THEN CAmount
										ELSE 0
									END AS net_amount
								FROM Transactions
							) t ON t.UserId = u.Id
							WHERE t.TransactionId = @TransactionId

						UPDATE Transactions
							SET DeletedDate = GETUTCDATE(),
								IsDeleted = 1
							WHERE TransactionId = @TransactionId

						Select TOP 1 'Entry deleted successfully.!' AS FLAG, 
						   1 AS Success
					END
					ELSE
					BEGIN
						Select TOP 1 'Reference Id does not match.' AS FLAG, 
						   0 AS Success
					END
				END
				ELSE
				BEGIN
					Select TOP 1 'Not able to delete the hawala entry, due to users have not enough balance.!' AS FLAG, 
						   0 AS Success
				END
			END
			ELSE
			BEGIN
				Select TOP 1 'Oops, something is missing, try again later.' AS FLAG, 
						   0 AS Success
			END
	END
	ELSE
	BEGIN
		Select TOP 1 'you have no rights to delete the entry.' AS FLAG, 
					   0 AS Success
	END
END
