
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Auth_Register '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[User_AddUser]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @Username VARCHAR(50),
			@Password VARCHAR(50),
			@IsMerchant BIT = 0,
			@WebsiteURL VARCHAR(MAX),
			@IsUser BIT = 1,
			@UserId INT = 0,
			@PartyCode NVARCHAR(50) = '',
			@PartyOwner INT = 0,
			@Exists BIT,
			@ThirdParty ThirdPartyType;

	SELECT DISTINCT TOP 1
				@Username = JSON_VALUE(@JsonData, '$.Username'),
				@Password = JSON_VALUE(@JsonData, '$.Password'),
				@IsMerchant = JSON_VALUE(@JsonData, '$.IsMerchant'),
				@WebsiteURL = JSON_VALUE(@JsonData, '$.WebsiteURL'),
				@IsUser = JSON_VALUE(@JsonData, '$.IsUser'),
				@PartyCode = JSON_VALUE(@JsonData, '$.PartyCode'),
				@PartyOwner = JSON_VALUE(@JsonData, '$.PartyOwner')
		FROM OPENJSON(@JsonData)

	---- FETCH Values from JSON Object
	INSERT INTO @ThirdParty
				   ([AssignParty]
				   ,[Commission])
			SELECT  JSON_VALUE(ThirdParty.VALUE, '$.AssignParty'),
					JSON_VALUE(ThirdParty.VALUE, '$.Commission')
			FROM	OPENJSON(@JsonData, '$.ThirdParty') AS ThirdParty

	IF NOT Exists(
				Select Top 1 1 
					From Users WITH (NOLOCK) 
					Where LOWER(Username) = LOWER(@Username)
						AND IsDelete = 0)
	BEGIN
			SELECT @Exists = 
				CASE 
					WHEN EXISTS (
						SELECT 1 
						FROM Parties WITH (NOLOCK)
						WHERE LOWER(PartyCode) = LOWER(@PartyCode)
					) THEN 1 
					ELSE 0 
				END;

			IF(@IsUser = 0 AND @Exists = 1)
			BEGIN
				
				Select TOP 1 'Party code already exits.' AS FLAG, 
					   0 AS Success

			END
			ELSE
			BEGIN

				INSERT INTO Users (RoleId, Username, Password, PartyOwner, Balance, IsMerchant, WebsiteURL, CreatedDate, AuthenticatorEnable, AuthenticatorSecretKey, IsDelete)
				VALUES (IIF(@IsUser = 1, 2, 5), @Username, @Password, ISNULL(@PartyOwner, 0), 0, @IsMerchant, @WebsiteURL, GETUTCDATE(), 0, NULL, 0)
				
				SET @UserId = SCOPE_IDENTITY();

				IF(@IsUser = 0)
				BEGIN
				
					INSERT INTO Parties (UserId, PartyCode)
					VALUES (@UserId, @PartyCode)

				END
				ELSE
				BEGIN
					
					INSERT INTO PartyCommission (UserId, PartyId, Commission)
					SELECT [UserId] = @UserId,
						   [AssignParty] = S.AssignParty,
						   [Commission] = S.Commission
						FROM @ThirdParty S

				END

				Select TOP 1 IIF(@IsUser = 1, 'User created successfully.', 'Party created successfully.') AS FLAG, 
						   1 AS Success

		    END
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Username already exits.' AS FLAG, 
					   0 AS Success
	END
END
