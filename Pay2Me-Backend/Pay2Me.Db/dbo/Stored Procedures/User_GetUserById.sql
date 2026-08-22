
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_GetUserById 1
-- =============================================
CREATE PROCEDURE [dbo].[User_GetUserById]
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
			
			Select TOP 1 1 AS Success,
			'' AS FLAG,
			AuthenticatorEnable,
			AuthenticatorSecretKey
				From Users WITH (NOLOCK)
				Where Id = @UserId
					AND IsDelete = 0
	
	END
	ELSE
	BEGIN

			Select TOP 1 'User is not found or something is wrong.' AS FLAG, 
					   0 AS Success
	END
END
