SELECT TotalResults = NULL, LocDataID, LocTypeID, HorizontalAccuracy, VerticalAccuracy, DateTimeStamp, TaskTypeID, Course, Speed, Point, TaskStateID, MyDayDateTimeStamp, StaffID, TotalTime, StartID FROM
(
	SELECT ROW_NUMBER() OVER
		(
			ORDER BY
		   		CASE WHEN @sortType = 'StaffID' AND @sortReverse = 0 THEN StaffID END ASC,
				CASE WHEN @sortType = 'StartID' AND @sortReverse = 0 THEN StartID END ASC,
				CASE WHEN @sortType = 'MyDayDateTimeStamp' AND @sortReverse = 0 THEN MyDayDateTimeStamp END ASC,
				CASE WHEN @sortType = 'LocDataID' AND @sortReverse = 0 THEN LocDataID END ASC,
				CASE WHEN @sortType = 'TotalTime' AND @sortReverse = 0 THEN TotalTime END ASC,
				CASE WHEN @sortType = 'StaffID' AND @sortReverse = 1 THEN StaffID END DESC,
				CASE WHEN @sortType = 'StartID' AND @sortReverse = 1 THEN StartID END DESC,
				CASE WHEN @sortType = 'MyDayDateTimeStamp' AND @sortReverse = 1 THEN MyDayDateTimeStamp END DESC,
				CASE WHEN @sortType = 'LocDataID' AND @sortReverse = 1 THEN LocDataID END DESC,
				CASE WHEN @sortType = 'TotalTime' AND @sortReverse = 1 THEN TotalTime END DESC
		) AS RowNum, * FROM tblLocationData
	WHERE @staffIDList LIKE ('%|' + CONVERT(VARCHAR,StaffID) + '|%')
	AND (StartID = @startID OR @startID = '')
	AND (MyDayDateTimeStamp BETWEEN @minMyDay AND @maxMyDay)
) AS RowConstrainedResult
WHERE RowNum >= @minRow
AND RowNum < @maxRow

UNION ALL
SELECT COUNT(*) AS TotalResults, LocDataID = NULL, LocTypeID = NULL, HorizontalAccuracy = NULL, VerticalAccuracy = NULL, DateTimeStamp = NULL, TaskTypeID = NULL, Course = NULL, Speed = NULL, Point = NULL, TaskStateID = NULL, MyDayDateTimeStamp = NULL, StaffID = NULL, TotalTime = NULL, StartID = NULL FROM tblLocationData
WHERE @staffIDList LIKE ('%|' + CONVERT(VARCHAR,StaffID) + '|%')
AND (StartID = @startID OR @startID = '')
AND (MyDayDateTimeStamp BETWEEN @minMyDay AND @maxMyDay)