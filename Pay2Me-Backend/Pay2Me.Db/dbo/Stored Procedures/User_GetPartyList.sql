
-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC User_GetPartyList @JsonData='{"PageNum":1, "PageSize":10, "SearchText": ""}', @LogInUserId=1
-- =============================================
CREATE PROCEDURE [dbo].[User_GetPartyList]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId BIGINT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- Insert statements for procedure here
	DECLARE 
			@TotalCount as INT,
			@Query NVARCHAR(MAX) = '',
			@UpdateQuery VARCHAR(MAX) = '',
			@PageNum int = 1,
			@PageSize int = 10,
			@SearchText varchar(50) = '',
			@RoleId INT;

	SELECT DISTINCT TOP 1
				@PageNum = JSON_VALUE(@JsonData, '$.PageNum'),
				@PageSize = JSON_VALUE(@JsonData, '$.PageSize'),
				@SearchText = JSON_VALUE(@JsonData, '$.SearchText')
		FROM OPENJSON(@JsonData);

	DROP TABLE IF EXISTS #SearchResult

	CREATE TABLE #SearchResult
	(
		RowNumber			INT,
		Id					INT,
		Partycode			VARCHAR(50),
		Username			VARCHAR(50),
		Balance				Money,
		CreatedDate			DATETIME,
		AuthenticatorEnable BIT
	)

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId AND IsDelete = 0)

	IF(@RoleId = 1)
	BEGIN

		SET @Query = @Query + '
			Select 
				1 AS RowNumber,
				u.Id,
				p.PartyCode AS Partycode,
				u.Username,
				u.Balance,
				--(SELECT COUNT(*) FROM Transactions WITH (NOLOCK) WHERE UserId = u.Id AND PaymentStatusId = 1) AS Reuqest,
				--(SELECT SUM(DAmount) FROM Transactions WITH (NOLOCK) WHERE UserId = u.Id AND PaymentStatusId = 1) AS AvailableBalance,
				u.CreatedDate,
				u.AuthenticatorEnable
			from Users u WITH (NOLOCK)
			INNER JOIN Parties p WITH (NOLOCK) ON p.UserId = u.Id
			WHERE u.IsDelete = 0
				AND u.RoleId = 5';

		IF((isnull(@SearchText,'')) <> '')
		BEGIN
		SET @Query = @Query + '
				AND ('''+@SearchText+''' IS NULL 
				OR u.Username LIKE ''%' + @SearchText + '%''
				OR u.Balance LIKE ''%' + @SearchText + '%''
				OR p.PartyCode LIKE ''%' + @SearchText + '%'')'
		END

		-- Inset records into #temp table
		PRINT @Query
		INSERT INTO #SearchResult	
		Exec (@Query)

		-- Update records by Column name, Column Dir 

		 SET @UpdateQuery = 'UPDATE T 
			 SET T.RowNumber = B.RowNum
			 From #SearchResult T
			 Inner Join (
						 Select Id,
							 ROW_NUMBER() OVER (
									 ORDER BY __OrderColumnName __OrderColumnDir
									 ) AS RowNum
						 FROM #SearchResult WITH (NOLOCK)
						 ) B
						 ON T.Id = B.Id'

		  SET @UpdateQuery = REPLACE(@UpdateQuery, '__OrderColumnName', 'Id')

		  SET @UpdateQuery = REPLACE(@UpdateQuery, '__OrderColumnDir', 'DESC')
		  PRINT @UpdateQuery

		  EXEC (@UpdateQuery)

		  -- Delete records from temp table

		 SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM #SearchResult WITH (NOLOCK)

		 print @TotalCount

		 IF(@PageSize < @TotalCount)
		 BEGIN
			 DELETE FROM #SearchResult 
					WHERE RowNumber NOT BETWEEN (((@PageNum  - 1) *	 @PageSize) + 1) AND (@PageNum * @PageSize)
		 END

		 Select 
			Id, 
			RowNumber as RowNum, 
			@TotalCount as TotalCount,
			Partycode,
			Username, 
			Balance,
			CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
			--AvailableBalance,
			--Request,
			AuthenticatorEnable
			--IsMerchant,
			--WebsiteURL
		 FROM #SearchResult WITH (NOLOCK)
		 ORDER BY RowNumber ASC

	END
	ELSE
	BEGIN

		Select TOP 0
			Id, 
			0 as RowNum, 
			0 as TotalCount, 
			Partycode,
			Username, 
			Balance,
			--Request,
			--AvailableBalance,
			CreatedDate,
			AuthenticatorEnable
			--IsMerchant,
			--WebsiteURL
		 FROM #SearchResult WITH (NOLOCK)
		 ORDER BY RowNumber ASC

	END
END
