
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Transactions_GetGeneralReportRequests 1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetGeneralReportRequests]
	-- Add the parameters for the stored procedure here
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @RoleId INT = 0,
			@TotalPendingAmount MONEY = 0,
			@TotalInProgressAmount MONEY = 0;

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);

	IF(@RoleId = 1)
	BEGIN
		
		
		SELECT 
				@TotalPendingAmount = (ISNULL(SUM(CAmount),0) + ISNULL(SUM(DAmount), 0))
			FROM Transactions 
			WHERE PaymentStatusId = 1
		
		SELECT 
				@TotalInProgressAmount = (ISNULL(SUM(CAmount),0) + ISNULL(SUM(DAmount),0))
			FROM Transactions 
			WHERE PaymentStatusId = 6
				
		SELECT 
			@TotalPendingAmount AS TotalPendingAmount,
			@TotalInProgressAmount AS TotalInProgressAmount

	END
	ELSE
	BEGIN
		
		SELECT TOP 1 
			0 AS TotalPendingAmount,
			0 AS TotalInProgressAmount

	END

END