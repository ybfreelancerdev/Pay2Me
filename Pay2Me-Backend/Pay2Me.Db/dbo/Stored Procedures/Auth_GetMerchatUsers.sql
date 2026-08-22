
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Auth_GetMerchatUsers 1
-- =============================================
CREATE PROCEDURE [dbo].[Auth_GetMerchatUsers]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT Id AS UserId,
	WebsiteURL
		FROM Users WITH(NOLOCK)
			WHERE IsDelete = 0
				AND IsMerchant = 1

END
