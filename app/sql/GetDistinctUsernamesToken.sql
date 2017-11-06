SELECT DISTINCT UserName FROM tblUsers
WHERE ProjectID = @projectID OR @projectID = ''
ORDER BY UserName