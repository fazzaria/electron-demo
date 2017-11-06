SELECT StaffMileageID, StaffID, Miles, RecordedOn, CreatedDt FROM tblStaffMileage
WHERE @staffIDList LIKE ('%|' + CONVERT(VARCHAR,StaffID) + '|%')
AND (RecordedOn BETWEEN @minRecordedOn AND @maxRecordedOn)
AND (CreatedDt BETWEEN @minCreatedDt AND @maxCreatedDt)