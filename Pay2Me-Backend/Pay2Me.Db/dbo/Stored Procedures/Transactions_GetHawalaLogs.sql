-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Transactions_GetHawalaLogs] @JsonData='{"PageNum":1, "PageSize":10, "SearchText": "", "Code" : "ACTIVE"}', @LogInUserId=1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetHawalaLogs]
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
			@RoleId INT = 0,
			@Code VARCHAR(10) = 'ACTIVE';

	SELECT DISTINCT TOP 1
				@PageNum = JSON_VALUE(@JsonData, '$.PageNum'),
				@PageSize = JSON_VALUE(@JsonData, '$.PageSize'),
				@SearchText = JSON_VALUE(@JsonData, '$.SearchText'),
				@Code = JSON_VALUE(@JsonData, '$.Code')
		FROM OPENJSON(@JsonData)

	DROP TABLE IF EXISTS #SearchResult

	CREATE TABLE #SearchResult
	(
		RowNumber			INT,
		Id					INT,
		TransactionId	    VARCHAR(15),
		CreditUserId		INT,
		CreditParty			VARCHAR(50),
		CParty				VARCHAR(10),
		DebitUserId			INT,
		DebitParty      	VARCHAR(50),
		DParty      	VARCHAR(10),
		Amount				MONEY,
		Descriptions		VARCHAR(500),
		CreatedDate			DATETIME,
		Remarks				VARCHAR(MAX),
		DeletedDate			DATETIME
	)

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);
	

	SET @Query = @Query + '
	SELECT 
			1 AS RowNumber,
			D.Id,
			D.TransactionId,
			CU.Id AS CreditId,
			CU.Username AS CreditParty,
			'''',
			DU.Id AS DebitId,
			DU.Username AS DebitParty,
			'''',
			D.DAmount AS Amount,
			D.Descriptions AS Description,
			D.CreatedDate,
			D.Remarks,
			D.DeletedDate
		FROM Transactions D
		INNER JOIN Transactions C
			ON D.TransactionId = C.TransactionId
			AND D.TransactionStatuId = 1
			AND C.TransactionStatuId = 2
			AND D.DAmount = C.CAmount
		INNER JOIN Users DU ON DU.Id = D.UserId
		INNER JOIN Users CU ON CU.Id = C.UserId
			WHERE D.TTypeId = 5
				AND C.TTypeId = 5';

	IF(@Code = 'ACTIVE')
	BEGIN
		SET @Query = @Query + '
			AND D.IsDeleted = 0
			AND C.IsDeleted = 0';
	END
	ELSE IF(@Code = 'DELETE')
	BEGIN
		SET @Query = @Query + '
			AND D.IsDeleted = 1
			AND C.IsDeleted = 1';
	END

	IF((isnull(@SearchText,'')) <> '')
	BEGIN
	SET @Query = @Query + '
			AND ('''+@SearchText+''' IS NULL 
			OR D.TransactionId LIKE ''%' + @SearchText + '%''
			OR DU.Username LIKE ''%' + @SearchText + '%''
			OR CU.Username LIKE ''%' + @SearchText + '%''
			OR D.DAmount LIKE ''%' + @SearchText + '%''
			OR D.Remarks LIKE ''%' + @SearchText + '%'')'
	END

	--SET @Query = @Query + '
	--	ORDER BY D.CreatedDate DESC';

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

	  SET @UpdateQuery = REPLACE(@UpdateQuery, '__OrderColumnName', 'CreatedDate')

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
	
	UPDATE sr
		SET sr.CParty = p.PartyCode,
			sr.DParty = pt.PartyCode
		FROM #SearchResult sr
		LEFT JOIN Parties p 
			ON p.UserId = sr.CreditUserId
		LEFT JOIN Parties pt 
			ON pt.UserId = sr.DebitUserId

	Select 
			Id, 
			RowNumber as RowNum, 
			@TotalCount as TotalCount, 
			TransactionId, 
			CreditUserId,
			IIF(ISNULL(CParty, '') = '', CreditParty, CParty +' ('+ CreditParty +')') AS CreditParty,
			DebitUserId, 
			DParty,
			IIF(ISNULL(DParty, '') = '', DebitParty, DParty +' ('+ DebitParty +')') AS DebitParty,
			CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
			Amount,
			Descriptions,
			Remarks,
			CAST(SWITCHOFFSET(DeletedDate, '+05:30') AS DATETIME) AS DeletedDate
	FROM #SearchResult WITH (NOLOCK)
	ORDER BY RowNumber ASC

END
