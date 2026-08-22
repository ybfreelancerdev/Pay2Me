
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_Update '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[Beneficiary_UpdateBeneficiary]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @Id INT,
			@BankName VARCHAR(50),
			@AccountNo VARCHAR(50),
			@AccountHolderName VARCHAR(50),
			@BranchName VARCHAR(50),
			@IFSCCode VARCHAR(50);
			--@Balance MONEY = 0;

	SELECT DISTINCT TOP 1
				@Id = JSON_VALUE(@JsonData, '$.Id'),
				@BankName = JSON_VALUE(@JsonData, '$.BankName'),
				@AccountNo = JSON_VALUE(@JsonData, '$.AccountNo'),
				@AccountHolderName = JSON_VALUE(@JsonData, '$.AccountHolderName'),
				@IFSCCode = JSON_VALUE(@JsonData, '$.IFSCCode')
		FROM OPENJSON(@JsonData)

	IF NOT Exists(
				Select Top 1 1 
					From Beneficiary WITH (NOLOCK) 
					Where AccountNo = @AccountNo AND Id <> @Id
						AND IsDeleted = 0 AND UserId = @LogInUserId)
	BEGIN

			UPDATE Beneficiary
				SET AccountNo = UPPER(@AccountNo),
					BankName = UPPER(@BankName),
					AccountHolderName = UPPER(@AccountHolderName),
					IFSCCode = UPPER(@IFSCCode)
				WHERE Id = @Id

			Select TOP 1 'Beneficiary updated successfully.' AS FLAG, 
					   1 AS Success
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Account number already exits.' AS FLAG, 
					   0 AS Success
	END
END
