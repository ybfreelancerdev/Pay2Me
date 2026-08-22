
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_GetRequestCount 1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetRequestCount]
	-- Add the parameters for the stored procedure here
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	Select COUNT(*) AS RequestCount, 1 AS Success
		from Transactions WITH (NOLOCK)
		where TransactionStatuId = 1 
			and PaymentStatusId = 1
			and RequestRead = 0

END
