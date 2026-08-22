
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Settings_GetMinMaxValueSetting '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[Settings_GetMinMaxValueSetting]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here

	SELECT TOP 1 * FROM Settings WITH (NOLOCK)
		WHERE LOWER(KeyName) = LOWER('MinMaxValue')
			AND IsEnable = 1
	
END
