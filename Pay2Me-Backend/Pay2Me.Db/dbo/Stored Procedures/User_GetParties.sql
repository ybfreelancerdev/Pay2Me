
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC User_GetParties
-- =============================================
CREATE PROCEDURE [dbo].[User_GetParties]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT
			U.Id,
			P.PartyCode +' ('+ U.Username +')' AS Username
		From Users U WITH (NOLOCK)
		INNER JOIN Parties P WITH (NOLOCK)
			ON P.UserId = U.Id
		WHERE U.IsDelete = 0
			AND U.RoleId = 5

END
