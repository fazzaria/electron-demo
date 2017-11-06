SELECT TOP 100 * FROM tblAppLog
WHERE 
(
Message LIKE '%Authorization from sso success, username: ' + @winsid + ', projectid: ' + @projectID + '%'
OR Message LIKE '%Authorize from sso failed, username: ' + @winsid + ', projectid: ' + @projectID + '%'
--OR Message LIKE '%Authorize ends, username: ' + @winsid + ', projectid: ' + @projectID + '%'
--OR Message LIKE '%Authorize Starts, username: ' + @winsid + ', projectid: ' + @projectID + '%'
)
AND (LogDate BETWEEN @minDate AND @maxDate)
ORDER BY LogDate DESC