USE [Pay2Me_dev]
GO
/****** Object:  StoredProcedure [dbo].[User_GetUserList]    Script Date: 30-11-2025 12:42:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 16-02-2024
-- Description:	<Description,,>
-- EXEC User_GetUserList @JsonData='{"PageNum":1, "PageSize":10, "SearchText": ""}', @LogInUserId=1
-- =============================================
ALTER PROCEDURE [dbo].[User_GetUserList]
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
		Username			VARCHAR(50),
		Balance				Money,
		Request				INT,
		AvailableBalance	MONEY,
		CreatedDate			DATETIME,
		AuthenticatorEnable BIT,
		IsMerchant			BIT,
		Limit				VARCHAR(500),
		WebsiteURL			VARCHAR(MAX),
		PartyOwner			VARCHAR(50),
		ThirdParty			VARCHAR(MAx)
	)

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId AND IsDelete = 0)

	IF(@RoleId = 1)
	BEGIN

		SET @Query = @Query + '
			Select 
				1 AS RowNumber,
				u.Id,
				u.Username,
				u.Balance,
				(SELECT SUM(DAmount) FROM Transactions WITH (NOLOCK) WHERE UserId = u.Id AND PaymentStatusId IN (1, 6)) AS Request,
				--(SELECT SUM(DAmount) FROM Transactions WITH (NOLOCK) WHERE UserId = u.Id AND PaymentStatusId = 1) AS AvailableBalance,
				u.Balance AS AvailableBalance,
				u.CreatedDate,
				u.AuthenticatorEnable,
				u.IsMerchant,
				u.Limit,
				u.WebsiteURL,
				ISNULL(po.Username, ''''),
				''''
			from Users u WITH (NOLOCK)
			LEFT JOIN Users po WITH (NOLOCK)
				ON po.Id = u.PartyOwner
			WHERE u.IsDelete = 0
				AND u.RoleId = 2';

		IF((isnull(@SearchText,'')) <> '')
		BEGIN
		SET @Query = @Query + '
				AND ('''+@SearchText+''' IS NULL 
				OR Username LIKE ''%' + @SearchText + '%''
				OR Balance LIKE ''%' + @SearchText + '%'')'
		END

		-- Inset records into #temp table
		PRINT @Query
		INSERT INTO #SearchResult	
		Exec (@Query)

		-- add party commission which assign to user
		SET @UpdateQuery = 'UPDATE SR
			SET
				SR.ThirdParty = PC_JSON.JsonData
			FROM #SearchResult AS SR
			INNER JOIN PartyCommission PC
				ON PC.UserId = SR.Id
			CROSS APPLY
			(
				SELECT
						pc2.PartyId,
						u.Username,
						pc2.Commission
					FROM PartyCommission pc2
					INNER JOIN Users u
						ON u.Id = pc2.PartyId
					WHERE pc2.UserId = SR.Id
					FOR JSON PATH
			) AS PC_JSON(JsonData)';

		EXEC (@UpdateQuery)
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
			Username, 
			(ISNULL(Balance, 0) + ISNULL(Request,0)) AS Balance,
			CAST(SWITCHOFFSET(CreatedDate, '+05:30') AS DATETIME) AS CreatedDate,
			ISNULL(AvailableBalance, 0) AS AvailableBalance,
			ISNULL(Request,0) AS Request,
			AuthenticatorEnable,
			IsMerchant,
			Limit,
			WebsiteURL,
			PartyOwner,
			ThirdParty
		 FROM #SearchResult WITH (NOLOCK)
		 ORDER BY RowNumber ASC

	END
	ELSE
	BEGIN

		Select TOP 0
			Id, 
			0 as RowNum, 
			0 as TotalCount, 
			Username, 
			0 As Balance,
			0 AS Request,
			0 AS AvailableBalance,
			CreatedDate,
			AuthenticatorEnable,
			IsMerchant,
			Limit,
			WebsiteURL,
			PartyOwner,
			ThirdParty
		 FROM #SearchResult WITH (NOLOCK)
		 ORDER BY RowNumber ASC

	END
END
