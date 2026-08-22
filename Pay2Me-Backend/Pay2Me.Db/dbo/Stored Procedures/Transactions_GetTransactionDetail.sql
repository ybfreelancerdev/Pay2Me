-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Beneficiary_GetTransactionDetail] '74318754842854', 2
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetTransactionDetail]
	-- Add the parameters for the stored procedure here
	@TransactionId VARCHAR(15),
	@UserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT TOP 1 *, 1 AS Success, '' AS FLAG 
		FROM UserLocationlogs WITH (NOLOCK)
		WHERE TransactionId = @TransactionId
			AND UserId = @UserId

END
