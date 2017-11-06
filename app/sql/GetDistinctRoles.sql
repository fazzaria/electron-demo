SELECT DISTINCT RoleType FROM tblUsers
WHERE ProjectID = @projectID OR ProjectID = ''
ORDER BY RoleType