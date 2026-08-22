
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_GetUserLimit 1
-- =============================================
CREATE PROCEDURE [dbo].[User_GetUserLimit]
	-- Add the parameters for the stored procedure here
	@UserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here

	SELECT TOP 1
		ISNULL(Limit, '') AS Limit
	  FROM Users WITH (NOLOCK)
		WHERE Id = @UserID
	
END
