
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_GetUserBeneficiaries 1
-- =============================================
CREATE PROCEDURE [dbo].[Beneficiary_GetUserBeneficiaries]
	-- Add the parameters for the stored procedure here
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	Select 
			Id,
			AccountNo,
			AccountHolderName,
			BankName,
			IFSCCode
		from Beneficiary WITH (NOLOCK)
	WHERE UserId = @LogInUserId
		AND IsDeleted = 0

END
