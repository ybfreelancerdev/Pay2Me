
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Transactions_GetHawalaUsers
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetHawalaUsers]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT
			U.Id,
			(U.Username +' - '+ LEFT(R.Role, 1)) AS Username,
			ISNULL(P.PartyCode, '') AS PartyCode
		From Users U WITH (NOLOCK)
		INNER JOIN Roles R WITH (NOLOCK)
			ON R.Id = U.RoleId
		LEFT JOIN Parties P WITH (NOLOCK)
			ON p.UserId = U.Id
		WHERE IsDelete = 0
			AND U.RoleId IN (2, 5)

END
