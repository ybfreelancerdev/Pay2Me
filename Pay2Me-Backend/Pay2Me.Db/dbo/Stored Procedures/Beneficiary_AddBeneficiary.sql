
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_AddEdit '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[Beneficiary_AddBeneficiary]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @BankName VARCHAR(50),
			@AccountNo VARCHAR(50),
			@AccountHolderName VARCHAR(50),
			@BranchName VARCHAR(50),
			@IFSCCode VARCHAR(50);
			--@Balance MONEY = 0;

	SELECT DISTINCT TOP 1
				@BankName = JSON_VALUE(@JsonData, '$.BankName'),
				@AccountNo = JSON_VALUE(@JsonData, '$.AccountNo'),
				@AccountHolderName = JSON_VALUE(@JsonData, '$.AccountHolderName'),
				@IFSCCode = JSON_VALUE(@JsonData, '$.IFSCCode')
		FROM OPENJSON(@JsonData)

	IF NOT Exists(
				Select Top 1 1 
					From Beneficiary WITH (NOLOCK) 
					Where AccountNo = @AccountNo
						AND IsDeleted = 0 AND UserId = @LogInUserId)
	BEGIN

			INSERT INTO Beneficiary (AccountId, UserId, BankName, AccountNo, AccountHolderName, IFSCCode, CreatedDate, IsDeleted)
			VALUES (NEWID(), @LogInUserId, UPPER(@BankName), UPPER(@AccountNo), UPPER(@AccountHolderName), UPPER(@IFSCCode), GETUTCDATE(), 0)

			Select TOP 1 'Beneficiary created successfully.' AS FLAG, 
					   1 AS Success
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Account number already exits.' AS FLAG, 
					   0 AS Success
	END
END
