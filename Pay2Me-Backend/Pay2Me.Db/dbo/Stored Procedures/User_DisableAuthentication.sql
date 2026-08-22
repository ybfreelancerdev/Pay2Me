
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC [User_DisableAuthentication] 1
-- =============================================
CREATE PROCEDURE [dbo].[User_DisableAuthentication]
	-- Add the parameters for the stored procedure here
	@UserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF Exists(
				Select Top 1 1 
					From Users WITH (NOLOCK) 
					Where Id = @UserId
						AND IsDelete = 0)
	BEGIN
			
			UPDATE Users SET AuthenticatorEnable = 0, AuthenticatorSecretKey = NULL
				WHERE Id = @UserId

			SELECT TOP 1 u.Username + '`s two factor authentication has been disabled.' AS FLAG,
				1 AS Success
				FROM Users u WHERE Id = @UserId
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Invalid username or password.' AS FLAG, 
					   0 AS Success
	END
END
