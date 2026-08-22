
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Auth_UserInfo 1
-- =============================================
CREATE PROCEDURE [dbo].[Auth_UserInfo]
	-- Add the parameters for the stored procedure here
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT U.Id,
		   U.Username,
		   U.Balance,
		   R.Role
		FROM Users U WITH(NOLOCK)
		INNER JOIN Roles R WITH (NOLOCK) ON R.Id = U.RoleId 
			WHERE U.Id = @LogInUserId

END
