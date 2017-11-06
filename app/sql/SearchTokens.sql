DECLARE @id INT;
SELECT @id = BFOSRoleID FROM tblUsers WHERE UserName = @username;
SELECT TotalResults = NULL, TokenID, Token, UserID, CreatedOn, ExpiresOn, ProjectID FROM 
(
	SELECT ROW_NUMBER() OVER
		(
			ORDER BY
			   CASE WHEN @sortType = 'TokenID' AND @sortReverse = 0 THEN TokenID END ASC,
			   CASE WHEN @sortType = 'Token' AND @sortReverse = 0 THEN Token END ASC,
			   CASE WHEN @sortType = 'UserID' AND @sortReverse = 0 THEN UserID END ASC,
			   CASE WHEN @sortType = 'CreatedOn' AND @sortReverse = 0 THEN CreatedOn END ASC,
			   CASE WHEN @sortType = 'ExpiresOn' AND @sortReverse = 0 THEN ExpiresOn END ASC,
			   CASE WHEN @sortType = 'ProjectID' AND @sortReverse = 0 THEN ProjectID END ASC,

			   CASE WHEN @sortType = 'TokenID' AND @sortReverse = 1 THEN TokenID END DESC,
			   CASE WHEN @sortType = 'Token' AND @sortReverse = 1 THEN Token END DESC,
			   CASE WHEN @sortType = 'UserID' AND @sortReverse = 1 THEN UserID END DESC,
			   CASE WHEN @sortType = 'CreatedOn' AND @sortReverse = 1 THEN CreatedOn END DESC,
			   CASE WHEN @sortType = 'ExpiresOn' AND @sortReverse = 1 THEN ExpiresOn END DESC,
			   CASE WHEN @sortType = 'ProjectID' AND @sortReverse = 1 THEN ProjectID END DESC
		) AS RowNum, * FROM AuthToken
	WHERE (CreatedOn BETWEEN @minCreatedOn AND @maxCreatedOn)
	AND (ExpiresOn BETWEEN @minExpiresOn AND @maxExpiresOn)
	AND (UserID = @id OR @username = 'undefined')
	AND (ProjectID = @projectID)
) AS RowConstrainedResult
WHERE RowNum >= @minRow 
AND RowNum < @maxRow

UNION ALL
SELECT COUNT(*) AS TotalResults, TokenID = NULL, Token = NULL, UserID = NULL, CreatedOn = NULL, ExpiresOn = NULL, ProjectID = NULL FROM AuthToken
WHERE (CreatedOn BETWEEN @minCreatedOn AND @maxCreatedOn)
AND (ExpiresOn BETWEEN @minExpiresOn AND @maxExpiresOn)
AND (UserID = @id OR @username = 'undefined')
AND (ProjectID = @projectID)