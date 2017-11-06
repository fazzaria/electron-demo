SELECT TotalResults = NULL, BFOSRoleID, UserName, Pwd, RoleType, Phrase, ProjectID, ActiveYN FROM 
(
	SELECT ROW_NUMBER() OVER 
		(
			ORDER BY
			   CASE WHEN @sortType = 'UserName' AND @sortReverse = 0 THEN UserName END ASC,
			   CASE WHEN @sortType = 'Pwd' AND @sortReverse = 0 THEN Pwd END ASC,
			   CASE WHEN @sortType = 'RoleType' AND @sortReverse = 0 THEN RoleType END ASC,
			   CASE WHEN @sortType = 'Phrase' AND @sortReverse = 0 THEN Phrase END ASC,
			   CASE WHEN @sortType = 'ProjectID' AND @sortReverse = 0 THEN ProjectID END ASC,
			   CASE WHEN @sortType = 'ActiveYN' AND @sortReverse = 0 THEN ActiveYN END ASC,

			   CASE WHEN @sortType = 'UserName' AND @sortReverse = 1 THEN UserName END DESC,
			   CASE WHEN @sortType = 'Pwd' AND @sortReverse = 1 THEN Pwd END DESC,
			   CASE WHEN @sortType = 'RoleType' AND @sortReverse = 1 THEN RoleType END DESC,
			   CASE WHEN @sortType = 'Phrase' AND @sortReverse = 1 THEN Phrase END DESC,
			   CASE WHEN @sortType = 'ProjectID' AND @sortReverse = 1 THEN ProjectID END DESC,
			   CASE WHEN @sortType = 'ActiveYN' AND @sortReverse = 1 THEN ActiveYN END DESC
		) AS RowNum, * FROM tblUsers
	WHERE (UserName LIKE '%' + RTRIM(@username) + '%' OR @username = '')
	AND (RoleType = @roleFilter OR @roleFilter = '')
	AND (ActiveYN = @activeFilter OR @activeFilter = '')
	AND (ProjectID = @projectID OR @projectID = '')
) AS RowConstrainedResult 
WHERE RowNum >= @minRow 
AND RowNum < @maxRow

UNION ALL
SELECT COUNT(*) AS TotalResults, BFOSRoleID = NULL, UserName = NULL, Pwd = NULL, RoleType = NULL, Phrase = NULL, ProjectID = NULL, ActiveYN = NULL FROM tblUsers
WHERE (UserName LIKE '%' + RTRIM(@username) + '%' OR @username = '')
AND (RoleType = @roleFilter OR @roleFilter = '')
AND (ActiveYN = @activeFilter OR @activeFilter = '')
AND (ProjectID = @projectID OR @projectID = '')