-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Transactions_GetTransactionList] @JsonData='{"PageNum":1, "PageSize":10, "SearchText": "", "UserId" : 130}', @LogInUserId=1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetTransactionList]
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
		AccountNo			VARCHAR(50),
		AccountHolderName	VARCHAR(50),
		BankName			VARCHAR(50),
		IFSCCode			VARCHAR(50),
		CreatedDate			DATETIME,
		DAmount  			MONEY,
		CAmount  			MONEY,
		Closing  			MONEY,
		PaymentStatus		VARCHAR(50),
		TransactionStatus   VARCHAR(50),
		Remarks				VARCHAR(MAx),
		Descriptions		VARCHAR(MAX),
		IsSettle			BIT,
		SourceType          VARCHAR(20)
	)

	IF(@UserId <> @LogInUserId)
	BEGIN
		SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);
	END

	SET @Query = @Query + '
	Select 
		1 AS RowNumber,
		t.Id,
		t.TransactionId,
		b.AccountNo,
		b.AccountHolderName,
		b.BankName,
		b.IFSCCode,
		t.CreatedDate,
		t.DAmount,
		t.CAmount,
		--t.Closing,
		 SUM(COALESCE(t.CAmount, 0) - COALESCE(t.DAmount, 0))
        OVER (ORDER BY t.CreatedDate, t.Id) AS Closing,
		p.PaymentStatus,
		ts.TransactionStatus,
		t.Remarks,
		t.Descriptions,
		t.IsSettle,
		''Transaction'' AS SourceType
	from Transactions t WITH (NOLOCK)
	LEFT JOIN TransactionLogs b WITH (NOLOCK) ON b.TransactionId = t.TransactionId
	INNER JOIN PaymentStatus p WITH (NOLOCK) ON p.Id = t.PaymentStatusId
	INNER JOIN TransactionStatus ts WITH (NOLOCK) ON ts.Id = t.TransactionStatuId
		WHERE t.IsDeleted = 0';

	IF(@RoleId <> 1)
	BEGIN
		SET @Query = @Query +'
		AND t.UserId = '+ CAST(@LogInUserId AS VARCHAR(10));
	END
	ELSE
	BEGIN
		SET @Query = @Query +'
		AND t.UserId = '+ CAST(@UserId AS VARCHAR(10));
	END

	IF((isnull(@SearchText,'')) <> '')
	BEGIN
	SET @Query = @Query + '
			AND ('''+@SearchText+''' IS NULL 
			OR t.TransactionId LIKE ''%' + @SearchText + '%''
			OR b.AccountNo LIKE ''%' + @SearchText + '%''
			OR b.AccountHolderName LIKE ''%' + @SearchText + '%''
			OR b.BankName LIKE ''%' + @SearchText + '%''
			OR b.IFSCCode LIKE ''%' + @SearchText + '%''
			OR t.DAmount LIKE ''%' + @SearchText + '%''
			OR t.CAmount LIKE ''%' + @SearchText + '%''
			--OR t.Closing LIKE ''%' + @SearchText + '%''
			OR p.PaymentStatus LIKE ''%' + @SearchText + '%'')'
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

	Select 
			Id, 
			RowNumber as RowNum, 
			@TotalCount as TotalCount, 
			TransactionId, 
			AccountNo, 
			AccountHolderName, 
			IFSCCode, 
			BankName, 
			CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
			DAmount,
			CAmount,
			Closing,
			PaymentStatus,
			TransactionStatus,
			Remarks,
			Descriptions,
			IsSettle,
			SourceType
	FROM #SearchResult WITH (NOLOCK)
	ORDER BY RowNumber ASC

END
