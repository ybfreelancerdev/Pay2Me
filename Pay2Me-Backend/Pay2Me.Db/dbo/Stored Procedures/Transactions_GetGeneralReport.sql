
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC Transactions_GetGeneralReport 1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetGeneralReport]
	-- Add the parameters for the stored procedure here
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @RoleId INT = 0;

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);

	IF(@RoleId = 1)
	BEGIN
		SELECT DISTINCT
				u.Id,
				IIF(r.Role = 'PARTY', p.PartyCode +' (' + u.Username + ')' ,u.Username) AS Username,
				u.Balance,
				r.Role,
				ISNULL(
					(
						SELECT TOP 1 IsSettle
						FROM Transactions WITH (NOLOCK)
						WHERE UserId = u.Id
						ORDER BY CreatedDate DESC
					),
					0
				) AS IsSettle
			FROM Users u WITH (NOLOCK)
			INNER JOIN Roles r WITH (NOLOCK)
				ON r.Id = u.RoleId
			LEFT JOIN Parties p WITH (NOLOCK)
				ON p.UserId = u.Id
			WHERE u.RoleId IN (2, 5)
				AND u.Balance <> 0
	END
	ELSE
	BEGIN
		SELECT TOP 1 
			0 AS Id,
			'' AS Username,
			0 AS Balance,
		    '' AS Role,
			0 AS IsSettle,
			'You have not rights to see hawala reports' AS FLAG, 
			0 AS Success

	END

END
