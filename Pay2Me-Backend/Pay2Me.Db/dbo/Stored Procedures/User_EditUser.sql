
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Auth_Register '8866459225'
-- =============================================
CREATE PROCEDURE [dbo].[User_EditUser]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @Id INT,
			@Username VARCHAR(50),
			@Password VARCHAR(50),
			@IsMerchant BIT = 0,
			@WebsiteURL VARCHAR(MAX),
			@IsUser BIT = 1,
			@PartyCode NVARCHAR(50) = '',
			@PartyOwner INT = 0,
			@Exists BIT,
			@ThirdParty ThirdPartyType;

	SELECT DISTINCT TOP 1
				@Id = JSON_VALUE(@JsonData, '$.Id'),
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
						AND IsDelete = 0
						AND Id <> @Id)
	BEGIN
			SELECT @Exists = 
				CASE 
					WHEN EXISTS (
						SELECT 1 
						FROM Parties WITH (NOLOCK)
						WHERE LOWER(PartyCode) = LOWER(@PartyCode)
							AND UserId <> @Id
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

				UPDATE Users
					SET Username = @Username,
						Password = @Password,
						PartyOwner = ISNULL(@PartyOwner, 0),
						IsMerchant = @IsMerchant,
						WebsiteURL = @WebsiteURL
					WHERE Id = @Id

				IF(@IsUser = 0)
				BEGIN
				
					UPDATE Parties
						SET PartyCode = @PartyCode
						WHERE UserId = @Id

				END
				ELSE
				BEGIN
					
					DELETE PC
						FROM PartyCommission PC
						INNER JOIN @ThirdParty S
							ON PC.UserId = @Id

					INSERT INTO PartyCommission (UserId, PartyId, Commission)
					SELECT [UserId] = @Id,
						   [AssignParty] = S.AssignParty,
						   [Commission] = S.Commission
						FROM @ThirdParty S

				END

				Select TOP 1 IIF(@IsUser = 1, 'User updated successfully.', 'Party updated successfully.') AS FLAG, 
						   1 AS Success

		    END
	
	END
	ELSE
	BEGIN

			Select TOP 1 'Username already exits.' AS FLAG, 
					   0 AS Success
	END
END
