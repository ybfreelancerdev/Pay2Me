-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- EXEC [dbo].[Transactions_GetAllRequestList] @JsonData='{"PageNum":1, "PageSize":10, "SearchText": "", "StatusId": 1}', @LogInUserId=1
-- =============================================
CREATE PROCEDURE [dbo].[Transactions_GetAllRequestList]
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
			@StatusId INT,
			@RoleId INT = 0;

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);

	IF(@RoleId <> 1)
	BEGIN
		Select TOP 1 'Access denied.' AS FLAG, 
					   0 AS Success
	END
	ELSE
	BEGIN

		SELECT DISTINCT TOP 1
					@PageNum = JSON_VALUE(@JsonData, '$.PageNum'),
					@PageSize = JSON_VALUE(@JsonData, '$.PageSize'),
					@SearchText = JSON_VALUE(@JsonData, '$.SearchText'),
					@StatusId = JSON_VALUE(@JsonData, '$.StatusId')
			FROM OPENJSON(@JsonData)

		DROP TABLE IF EXISTS #SearchResult

		CREATE TABLE #SearchResult
		(
			RowNumber			INT,
			Id					INT,
			Username			VARCHAR(50),
			TransactionId		VARCHAR(15),
			ReferenceId			VARCHAR(6),
			AccountNo			VARCHAR(50),
			AccountHolderName	VARCHAR(50),
			BankName			VARCHAR(50),
			IFSCCode			VARCHAR(50),
			CreatedDate			DATETIME,
			Amount  			MONEY,
			PaymentStatus		VARCHAR(50),
			TransactionStatus   VARCHAR(50)
		)

		SET @Query = @Query + '
		Select 
			1 AS RowNumber,
			t.Id,
			u.Username,
			t.TransactionId,
			t.ReferenceId,
			b.AccountNo,
			b.AccountHolderName,
			b.BankName,
			b.IFSCCode,
			t.CreatedDate,
			t.DAmount,
			p.PaymentStatus,
			ts.TransactionStatus
		from Transactions t WITH (NOLOCK)
		INNER JOIN Users u WITH (NOLOCK) ON u.Id = t.UserId
		LEFT JOIN TransactionLogs b WITH (NOLOCK) ON b.TransactionId = t.TransactionId
		INNER JOIN PaymentStatus p WITH (NOLOCK) ON p.Id = t.PaymentStatusId
		INNER JOIN TransactionStatus ts WITH (NOLOCK) ON ts.Id = t.TransactionStatuId';

		IF((ISNULL(@StatusId,'')) <> 0)
		BEGIN
			SET @Query = @Query +'
			WHERE t.PaymentStatusId = 1
				AND ISNULL(t.DAmount, 0) <> 0
				AND t.TransactionStatuId = '+ CAST(@StatusId AS VARCHAR(10));
		END

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
		
		UPDATE t
			SET t.RequestRead = 1
			FROM #SearchResult sr
			INNER JOIN Transactions t on t.Id = sr.Id AND t.TransactionId = sr.TransactionId
		
		Select 
				Id, 
				RowNumber as RowNum, 
				@TotalCount as TotalCount,
				Username,
				TransactionId, 
				ReferenceId,
				AccountNo, 
				AccountHolderName, 
				IFSCCode, 
				BankName, 
				CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
				Amount,
				PaymentStatus,
				TransactionStatus,
				'' AS Remarks,
				0 AS AssignParty
		FROM #SearchResult WITH (NOLOCK)
		ORDER BY RowNumber ASC
	END
END
