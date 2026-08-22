
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Settings_GetMinMaxValueLimits 1
-- =============================================
CREATE PROCEDURE [dbo].[Settings_GetMinMaxValueLimits]
	-- Add the parameters for the stored procedure here
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here

	IF EXISTS (
		SELECT TOP 1 1
			FROM Users WITH (NOLOCK)
			WHERE Id = @LogInUserId
				AND ISNULL(Limit, '') <> ''

	)
	BEGIN

		SELECT TOP 1
				Id,
				'MinMaxValue' AS KeyName,
				Limit AS KeyValue,
				1 AS IsEnable
			FROM Users WITH (NOLOCK) 
			WHERE Id = @LogInUserId

	END
	ELSE
	BEGIN
	
		SELECT TOP 1
				*
			FROM Settings WITH (NOLOCK)
		WHERE LOWER(KeyName) = LOWER('MinMaxValue')
			AND IsEnable = 1

	END
END
