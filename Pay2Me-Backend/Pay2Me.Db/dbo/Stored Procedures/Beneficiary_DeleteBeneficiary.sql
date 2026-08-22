
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_DeleteBeneficiary 1
-- =============================================
CREATE PROCEDURE [dbo].[Beneficiary_DeleteBeneficiary]
	-- Add the parameters for the stored procedure here
	@BeneficiaryId INT,
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF Exists(
				Select Top 1 1 
					From Beneficiary WITH (NOLOCK) 
					Where Id = @BeneficiaryId
						AND IsDeleted = 0 AND UserId = @LogInUserId)
	BEGIN

			UPDATE Beneficiary
				SET IsDeleted = 1
				WHERE Id = @BeneficiaryId
			
			Select TOP 1 'Beneficiary deleted successfully.' AS FLAG, 
					   1 AS Success
	END
	ELSE
	BEGIN

			Select TOP 1 'Beneficiary not found or already deleted.!' AS FLAG, 
					   0 AS Success
	END
END
