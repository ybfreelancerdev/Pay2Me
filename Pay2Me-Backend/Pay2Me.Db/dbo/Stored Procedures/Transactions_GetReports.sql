-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Transactions_GetReports] @JsonData='{"PageNum":1, "PageSize":50, "SearchText": "", "StatusId": 1}', @LogInUserId=1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetReports]
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
			@RoleId INT = 0;

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);

	IF(@RoleId = 2)
	BEGIN
		Select TOP 1 'Access denied.' AS FLAG, 
					   0 AS Success
	END
	ELSE
	BEGIN

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
			UserId				INT,
			Username			VARCHAR(50),
			TransactionId		VARCHAR(15),
			ReferenceId		VARCHAR(6),
			AccountNo			VARCHAR(50),
			AccountHolderName	VARCHAR(50),
			BankName			VARCHAR(50),
			IFSCCode			VARCHAR(50),
			CreatedDate			DATETIME,
			Amount  			MONEY,
			PaymentStatus		VARCHAR(50),
			TransactionStatus   VARCHAR(50),
			Remarks				VARCHAR(MAX),
			IsBypassURL			BIT,
			AssignParty			INT,
			Descriptions		VARCHAR(MAX)
		)

		SET @Query = @Query + '
		Select 
			1 AS RowNumber,
			t.Id,
			t.UserId,
			u.Username,
			t.TransactionId,
			t.ReferenceId,
			b.AccountNo,
			b.AccountHolderName,
			b.BankName,
			b.IFSCCode,
			t.CreatedDate,
			CASE
				WHEN t.DAmount = 0
				THEN t.CAmount
				ELSE t.DAmount
			END AS Amount,
			p.PaymentStatus,
			ts.TransactionStatus,
			t.Remarks,
			CASE
				WHEN ul.Id IS NULL
				THEN 1
				ELSE 0
			END AS IsBypassURL,
			t.AssignParty,
			t.Descriptions
		from Transactions t WITH (NOLOCK)
		INNER JOIN Users u WITH (NOLOCK) ON u.Id = t.UserId
		LEFT JOIN TransactionLogs b WITH (NOLOCK) ON b.TransactionId = t.TransactionId
		INNER JOIN PaymentStatus p WITH (NOLOCK) ON p.Id = t.PaymentStatusId
		INNER JOIN TransactionStatus ts WITH (NOLOCK) ON ts.Id = t.TransactionStatuId
		LEFT JOIN UserLocationlogs ul WITH (NOLOCK) ON ul.TransactionId = t.TransactionId AND ul.UserId = u.Id
		WHERE ISNULL(t.IsUserCommissionEntry, 0) = 0
			AND TTypeId <>' + CAST(3 AS varchar) +'
			AND u.RoleId <>'+ CAST(5 AS VARCHAR);

		IF((isnull(@SearchText,'')) <> '')
		BEGIN
		SET @Query = @Query + '
				AND ('''+@SearchText+''' IS NULL 
				OR u.Username LIKE ''%' + @SearchText + '%''
				OR t.TransactionId LIKE ''%' + @SearchText + '%''
				OR t.ReferenceId LIKE ''%' + @SearchText + '%''
				OR b.AccountNo LIKE ''%' + @SearchText + '%''
				OR b.AccountHolderName LIKE ''%' + @SearchText + '%''
				OR b.BankName LIKE ''%' + @SearchText + '%''
				OR b.IFSCCode LIKE ''%' + @SearchText + '%''
				OR t.DAmount LIKE ''%' + @SearchText + '%''
				OR t.CAmount LIKE ''%' + @SearchText + '%''
				OR p.PaymentStatus LIKE ''%' + @SearchText + '%''
				OR t.CreatedDate LIKE ''%' + @SearchText + '%'')'
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

		 IF(@PageSize < @TotalCount)
		 BEGIN
			 DELETE FROM #SearchResult 
					WHERE RowNumber NOT BETWEEN (((@PageNum  - 1) *	 @PageSize) + 1) AND (@PageNum * @PageSize)
		 END

	------------------------------------------------------------------------------------------------------------------------------------

		Select 
				t.Id, 
				t.RowNumber as RowNum, 
				@TotalCount as TotalCount,
				t.Username,
				t.UserId,
				t.TransactionId, 
				t.ReferenceId,
				t.AccountNo, 
				t.AccountHolderName, 
				t.IFSCCode, 
				t.BankName, 
				CAST(SWITCHOFFSET(t.CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
				t.Amount,
				t.PaymentStatus,
				t.TransactionStatus,
				t.Remarks,
				t.IsBypassURL,
				t.AssignParty,
				u.Username AS AssignPartyName,
				t.Descriptions
		FROM #SearchResult t WITH (NOLOCK)
		LEFT JOIN Users u WITH (NOLOCK)
			ON u.Id = t.AssignParty
				AND u.IsDelete = 0
		ORDER BY RowNumber ASC
	END
END
