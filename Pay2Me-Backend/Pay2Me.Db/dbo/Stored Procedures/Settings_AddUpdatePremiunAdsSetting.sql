
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Settings_AddUpdatePremiunAdsSetting '8866459225'
-- =============================================
Create PROCEDURE [dbo].[Settings_AddUpdatePremiunAdsSetting]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@Flag VARCHAR(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here

	IF(@Flag = 'AddUpdate')
	BEGIN

		IF Exists(
					Select Top 1 1 
						From Settings WITH (NOLOCK) 
						Where LOWER(KeyName) = LOWER('PremiunAds')
					)
		BEGIN

				UPDATE Settings
					SET KeyValue = @JsonData,
						IsEnable = 1
				WHERE LOWER(KeyName) = LOWER('PremiunAds')

				Select TOP 1 'Premiun ads updated.' AS FLAG, 
						   1 AS Success
	
		END
		ELSE
		BEGIN
				INSERT Settings (KeyName, KeyValue, IsEnable)
				VALUES ('PremiunAds', @JsonData, 1)

				Select TOP 1 'Premiun ads updated.' AS FLAG, 
						   1 AS Success
		END

	END
	ELSE
	BEGIN

		UPDATE Settings
					SET IsEnable = 0
				WHERE LOWER(KeyName) = LOWER('PremiunAds')

				Select TOP 1 'Premiun ads disable successfully.' AS FLAG, 
						   1 AS Success

	END
END
