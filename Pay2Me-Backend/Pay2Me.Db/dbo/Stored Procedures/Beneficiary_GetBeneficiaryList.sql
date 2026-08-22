-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Beneficiary_GetBeneficiaryList] @JsonData='{"PageNum":1, "PageSize":10, "SearchText": ""}', @LogInUserId=3
-- =============================================
CREATE PROCEDURE [dbo].[Beneficiary_GetBeneficiaryList]
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
			@SearchText varchar(50) = ''

	SELECT DISTINCT TOP 1
				@PageNum = JSON_VALUE(@JsonData, '$.PageNum'),
				@PageSize = JSON_VALUE(@JsonData, '$.PageSize'),
				@SearchText = JSON_VALUE(@JsonData, '$.SearchText')
		FROM OPENJSON(@JsonData)

	DROP TABLE IF EXISTS #SearchResult

	CREATE TABLE #SearchResult
	(
		RowNumber			INT,
		Id					INT,
		BankName			VARCHAR(50),
		AccountNo			VARCHAR(50),
		AccountHolderName	VARCHAR(50),		
		IFSCCode			VARCHAR(50),
		CreatedDate			DATETIME,
		IsDeleted			BIT
	)

	SET @Query = @Query + '
	Select 
		1 AS RowNumber,
		Id,
		BankName,
		AccountNo,
		AccountHolderName,
		IFSCCode,
		CreatedDate,
		IsDeleted
	from Beneficiary WITH (NOLOCK)
	WHERE IsDeleted = 0 AND UserId = '+ CAST(@LogInUserId AS VARCHAR(10));

	IF((isnull(@SearchText,'')) <> '')
	BEGIN
	SET @Query = @Query + '
			AND ('''+@SearchText+''' IS NULL 
			OR BankName LIKE ''%' + @SearchText + '%''
			OR AccountNo LIKE ''%' + @SearchText + '%''
			OR AccountHolderName LIKE ''%' + @SearchText + '%''
			OR IFSCCode LIKE ''%' + @SearchText + '%'')'
	END

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
			BankName, 
			AccountNo, 
			AccountHolderName, 
			IFSCCode, 
			IsDeleted, 
			CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate		
	FROM #SearchResult WITH (NOLOCK)
	ORDER BY RowNumber ASC

END
