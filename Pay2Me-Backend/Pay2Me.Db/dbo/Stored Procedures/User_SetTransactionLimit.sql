
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC User_SetTransactionLimit '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[User_SetTransactionLimit]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@UserId INT,
	@Flag VARCHAR(10),
	@LogInUserId BIGINT
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
						From Users WITH (NOLOCK) 
						Where Id = @UserId
					)
		BEGIN
			
			UPDATE Users
					SET Limit = @JsonData
				WHERE Id = @UserId

				Select TOP 1 'User limit has been set.' AS FLAG, 
						   1 AS Success
		END
		ELSE
		BEGIN
				Select TOP 1 'User not found.' AS FLAG, 
						   0 AS Success
		END

	END
	ELSE
	BEGIN

		UPDATE Users
			SET Limit = NULL
		WHERE Id = @UserId

		Select TOP 1 'User limit has been reset.' AS FLAG, 
					1 AS Success

	END
	
END
