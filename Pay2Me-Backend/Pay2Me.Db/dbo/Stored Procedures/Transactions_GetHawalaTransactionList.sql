-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Transactions_GetHawalaTransactionList] @JsonData='{"PageNum":1, "PageSize":10, "SearchText": "", "UserId" : 129}', @LogInUserId=1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetHawalaTransactionList]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
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
			@UserId INT = 0,
			@RoleId INT = 0;

	SELECT DISTINCT TOP 1
				@PageNum = JSON_VALUE(@JsonData, '$.PageNum'),
				@PageSize = JSON_VALUE(@JsonData, '$.PageSize'),
				@UserId = JSON_VALUE(@JsonData, '$.UserId'),
				@SearchText = JSON_VALUE(@JsonData, '$.SearchText')
		FROM OPENJSON(@JsonData)

	DROP TABLE IF EXISTS #SearchResult

	CREATE TABLE #SearchResult
	(
		RowNumber			INT,
		Id					INT,
		TransactionId		VARCHAR(15),
		DAmount  			MONEY,
		CAmount  			MONEY,
		Closing  			MONEY,
		Descriptions		VARCHAR(500),
		CreatedDate			DATETIME,
		Remarks				VARCHAR(MAX)
	)

	IF(@UserId <> @LogInUserId)
	BEGIN
		SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);
	END
	

	SET @Query = @Query + '
	SELECT
			1 AS RowNumber,
			t.Id,
			t.TransactionId,
			t.DAmount,
			t.CAmount,
			t.Closing,
			t.Descriptions,
			t.CreatedDate,
			t.Remarks
		FROM dbo.Transactions t WITH(NOLOCK)';

	IF(@RoleId <> 1)
	BEGIN
		SET @Query = @Query +'
		WHERE t.UserId = '+ CAST(@LogInUserId AS VARCHAR(10));
	END
	ELSE
	BEGIN
		SET @Query = @Query +'
		WHERE t.UserId = '+ CAST(@UserId AS VARCHAR(10));
	END

	SET @Query = @Query +'
		AND t.IsDeleted = 0';

	IF((isnull(@SearchText,'')) <> '')
	BEGIN
	SET @Query = @Query + '
			AND ('''+@SearchText+''' IS NULL 
			OR t.TransactionId LIKE ''%' + @SearchText + '%''
			OR t.DAmount LIKE ''%' + @SearchText + '%''
			OR t.CAmount LIKE ''%' + @SearchText + '%''
			OR t.Closing LIKE ''%' + @SearchText + '%''
			OR t.Remarks LIKE ''%' + @SearchText + '%'')'
	END

	SET @Query = @Query + '
		ORDER BY t.CreatedDate DESC';

	PRINT @Query
-----------------------------------------------------------------------------------------------------------------------------------
	 -- Inset records into #temp table

	 INSERT INTO #SearchResult	
	 Exec (@Query)

-----------------------------------------------------------------------------------------------------------------------------------
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

-----------------------------------------------------------------------------------------------------------------------------------
	-- Delete records from temp table

	 SELECT @TotalCount = COUNT(DISTINCT(Id)) FROM #SearchResult WITH (NOLOCK)

	 print @TotalCount

	 IF(@PageSize < @TotalCount)
	 BEGIN
		 DELETE FROM #SearchResult 
				WHERE RowNumber NOT BETWEEN (((@PageNum  - 1) *	 @PageSize) + 1) AND (@PageNum * @PageSize)
	 END

------------------------------------------------------------------------------------------------------------------------------------

	Select 
			Id, 
			RowNumber as RowNum, 
			@TotalCount as TotalCount, 
			TransactionId, 
			DAmount, 
			CAmount, 
			Closing, 
			Descriptions, 
			CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
			Remarks
	FROM #SearchResult WITH (NOLOCK)
	ORDER BY RowNumber ASC

END
