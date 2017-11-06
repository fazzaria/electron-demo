SELECT TotalResults = NULL, SUID, STATUSCODE, DATEDIFF(millisecond, DATEADD(hour, -4, CreatedLocalTime), CREATEDT) AS TimeTaken FROM
(
  SELECT ROW_NUMBER() OVER
  (
    ORDER BY
    CASE WHEN @sortType = 'SUID' AND @sortReverse = 0 THEN SUID END ASC,
    CASE WHEN @sortType = 'STATUSCODE' AND @sortReverse = 0 THEN STATUSCODE END ASC,
    CASE WHEN @sortType = 'TimeTaken' AND @sortReverse = 0 THEN CREATEDT END ASC,

    CASE WHEN @sortType = 'SUID' AND @sortReverse = 1 THEN SUID END DESC,
    CASE WHEN @sortType = 'STATUSCODE' AND @sortReverse = 1 THEN STATUSCODE END DESC,
    CASE WHEN @sortType = 'TimeTaken' AND @sortReverse = 1 THEN CREATEDT END DESC
  ) AS RowNum, * FROM vActivityLog
  WHERE STATUSSOURCEID = 'E'
  AND CREATEDT BETWEEN @minDate AND @maxDate
  AND IDSERIES = 'M'
  AND (STATUSCODE = @statusCode OR @statusCode = '')
  AND (SUID = @suid OR @suid = -1)
) AS RowConstainedResult
WHERE RowNum >= @minRow
AND RowNum < @maxRow

UNION ALL
SELECT COUNT(*) AS TotalResults, SUID = NULL, STATUSCODE = NULL, TimeTaken = NULL
FROM vActivityLog
WHERE STATUSSOURCEID = 'E'
AND CREATEDT BETWEEN @minDate AND @maxDate
AND IDSERIES = 'M'
AND (STATUSCODE = @statusCode OR @statusCode = '')
AND (SUID = @suid OR @suid = -1)