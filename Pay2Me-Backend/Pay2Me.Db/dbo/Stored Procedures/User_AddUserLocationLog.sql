
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC UserLocationLogs '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[User_AddUserLocationLog]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @TransactionId VARCHAR(15),
			@Latitude VARCHAR(50),
			@Longitude VARCHAR(50),
			@IpAddress VARCHAR(MAX);

	SELECT DISTINCT TOP 1
				@TransactionId = JSON_VALUE(@JsonData, '$.TransactionId'),
				@Latitude = JSON_VALUE(@JsonData, '$.Latitude'),
				@Longitude = JSON_VALUE(@JsonData, '$.Longitude'),
				@IpAddress = JSON_VALUE(@JsonData, '$.IpAddress')
		FROM OPENJSON(@JsonData)

			INSERT INTO UserLocationlogs (UserId, TransactionId, Latitude, Longitude, IpAddress)
			VALUES (@LogInUserId, @TransactionId, @Latitude, @Longitude, @IpAddress)

			Select TOP 1 'Transaction log added successfully.' AS FLAG, 
					   1 AS Success
	
END
