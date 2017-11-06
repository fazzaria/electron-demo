SELECT TotalResults = NULL, Id, LogDate, Thread, Level, Logger, Message, Exception FROM 
(
	SELECT ROW_NUMBER() OVER
		(
			ORDER BY
			   CASE WHEN @sortType = 'Id' AND @sortReverse = 0 THEN Id END ASC,
			   CASE WHEN @sortType = 'LogDate' AND @sortReverse = 0 THEN LogDate END ASC,
			   CASE WHEN @sortType = 'Level' AND @sortReverse = 0 THEN Level END ASC,
			   CASE WHEN @sortType = 'Logger' AND @sortReverse = 0 THEN Logger END ASC,
			   CASE WHEN @sortType = 'Thread' AND @sortReverse = 0 THEN Thread END ASC,
			   CASE WHEN @sortType = 'Message' AND @sortReverse = 0 THEN Message END ASC,
			   CASE WHEN @sortType = 'Exception' AND @sortReverse = 0 THEN Exception END ASC,

			   CASE WHEN @sortType = 'Id' AND @sortReverse = 1 THEN Id END DESC,
			   CASE WHEN @sortType = 'LogDate' AND @sortReverse = 1 THEN LogDate END DESC,
			   CASE WHEN @sortType = 'Level' AND @sortReverse = 1 THEN Level END DESC,
			   CASE WHEN @sortType = 'Logger' AND @sortReverse = 1 THEN Logger END DESC,
			   CASE WHEN @sortType = 'Thread' AND @sortReverse = 1 THEN Thread END DESC,
			   CASE WHEN @sortType = 'Message' AND @sortReverse = 1 THEN Message END DESC,
			   CASE WHEN @sortType = 'Exception' AND @sortReverse = 1 THEN Exception END DESC
		) AS RowNum, * FROM tblAppLog
	WHERE 
		(
			@searchText = ''
			OR ((@messageOrException = '' AND ((Message LIKE '%' + RTRIM(@searchText) + '%') OR Exception LIKE ('%' + RTRIM(@searchText) + '%')))
			OR (@messageOrException = 'Message' AND Message LIKE '%' + RTRIM(@searchText) + '%')
			OR (@messageOrException = 'Exception' AND Exception LIKE '%' + RTRIM(@searchText) + '%'))	
		)
	AND (Level = @levelFilter OR @levelFilter = '')
	AND (Logger = @loggerFilter OR @loggerFilter = '')
	AND (LogDate BETWEEN @minLogDate AND @maxLogDate)
	AND (((@idMin <= Id) AND (Id <= @idMax)) OR (@idMin = -1))
) AS RowConstrainedResult 
WHERE RowNum >= @minRow 
AND RowNum < @maxRow

UNION ALL
SELECT COUNT(*) AS TotalResults, Id = NULL, LogDate = NULL, Thread = NULL, Level = NULL, Logger = NULL, Message = NULL, Exception = NULL FROM tblAppLog
WHERE 
	(
		(@messageOrException = '' AND ((Message LIKE '%' + RTRIM(@searchText) + '%') OR Exception LIKE ('%' + RTRIM(@searchText) + '%')))
		OR (@messageOrException = 'Message' AND Message LIKE '%' + RTRIM(@searchText) + '%')
		OR (@messageOrException = 'Exception' AND Exception LIKE '%' + RTRIM(@searchText) + '%')
	)
AND (Level = @levelFilter OR @levelFilter = '')
AND (((@idMin <= Id) AND (Id <= @idMax)) OR (@idMin = -1))
AND (Logger = @loggerFilter OR @loggerFilter = '')
AND (LogDate BETWEEN @minLogDate AND @maxLogDate)