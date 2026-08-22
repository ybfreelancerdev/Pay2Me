
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_ChangePassword '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[User_ChangePassword]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @UserId INT,
			@Password VARCHAR(MAX);

	SELECT DISTINCT TOP 1
				@UserId = JSON_VALUE(@JsonData, '$.UserId'),
				@Password = JSON_VALUE(@JsonData, '$.Password')
		FROM OPENJSON(@JsonData)

	IF EXISTS(SELECT TOP 1 1
			FROM Users WITH (NOLOCK)
				WHERE Id = @UserId)
	BEGIN
				
		UPDATE Users
			SET Password = @Password
				WHERE Id = @UserId

		SELECT TOP 1 'Password changed' AS FLAG, 1 AS Success
	
	END
	ELSE
	BEGIN
		SELECT TOP 1 'User not found!' AS FLAG, 0 AS Success
	END
END
