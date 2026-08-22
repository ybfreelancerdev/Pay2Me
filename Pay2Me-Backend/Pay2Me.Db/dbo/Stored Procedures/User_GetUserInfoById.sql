
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_GetUserInfoById 132
-- =============================================
CREATE PROCEDURE [dbo].[User_GetUserInfoById]
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
			
			SELECT
				TOP 1
					Id,
					Username,
					Password,
					IsMerchant,
					WebsiteURL,
					PartyOwner,
					(
						SELECT 
							p.PartyId,
							p.Commission
						FROM PartyCommission p
						WHERE p.UserId = @UserId
						FOR JSON PATH
					) AS ThirdParty,
					(SELECT TOP 1 PartyCode FROM Parties WHERE UserId = @UserId) AS PartyCode
				FROM Users WITH (NOLOCK)
				WHERE Id = @UserId
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Information not found or something is wrong.' AS FLAG, 
					   0 AS Success
	END
END
