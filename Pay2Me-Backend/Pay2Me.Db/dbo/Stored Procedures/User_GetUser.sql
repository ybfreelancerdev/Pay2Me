
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_GetUserFromUsername ''
-- =============================================
CREATE PROCEDURE [dbo].[User_GetUser]
	-- Add the parameters for the stored procedure here
	@Username VARCHAR(50),
	@Password VARCHAR(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF Exists(
				Select Top 1 1 
					From Users WITH (NOLOCK) 
					Where LOWER(Username) = LOWER(@Username)
						AND Password = @Password
						AND IsDelete = 0)
	BEGIN
			
			Select TOP 1 1 AS Success,
			'' AS FLAG,
			AuthenticatorEnable,
			AuthenticatorSecretKey
				From Users WITH (NOLOCK)
				Where LOWER(Username) = LOWER(@Username)
					AND Password = @Password
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Invalid username or password.' AS FLAG, 
					   0 AS Success
	END
END
