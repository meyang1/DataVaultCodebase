const db = require('../config/db');

function handleError(res, err) {
  console.error(err);
  return res.send('Database error');
}

exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};

exports.listUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM User');
    res.render('admin/users', { users: rows });
  } catch (e) {
    handleError(res, e);
  }
};

exports.newUserForm = async (req, res) => {
  const [hospitals] = await db.query('SELECT HospitalID, Name FROM Hospital');
  res.render('admin/user_form', {
    user: {},
    hospitals,
    action: '/admin/users'
  });
};

exports.createUser = async (req, res) => {
  const { HospitalID, Username, PasswordHash, Role, Email } = req.body;
  try {
    await db.query(
      'INSERT INTO User (HospitalID, Username, PasswordHash, Role, Email) VALUES (?, ?, ?, ?, ?)',
      [HospitalID, Username, PasswordHash, Role, Email]
    );
    res.redirect('/admin/users');
  } catch (e) {
    handleError(res, e);
  }
};

exports.editUserForm = async (req, res) => {
  const id = req.params.id;
  try {
    const [[user]] = await db.query(
      'SELECT * FROM User WHERE UserID = ?',
      [id]
    );
    const [hospitals] = await db.query(
      'SELECT HospitalID, Name FROM Hospital'
    );
    res.render('admin/user_form', {
      user,
      hospitals,
      action: `/admin/users/${id}`
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { HospitalID, Username, PasswordHash, Role, Email } = req.body;
  try {
    await db.query(
      'UPDATE User SET HospitalID=?, Username=?, PasswordHash=?, Role=?, Email=? WHERE UserID=?',
      [HospitalID, Username, PasswordHash, Role, Email, id]
    );
    res.redirect('/admin/users');
  } catch (e) {
    handleError(res, e);
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await db.query(
      'DELETE FROM User WHERE UserID=?',
      [id]
    );
    res.redirect('/admin/users');
  } catch (e) {
    handleError(res, e);
  }
};

exports.listPatients = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, h.Name AS HospitalName
        FROM Patient p
        LEFT JOIN Hospital h ON p.HospitalID = h.HospitalID
    `);
    res.render('admin/patients', { patients: rows });
  } catch (e) {
    handleError(res, e);
  }
};

exports.newPatientForm = async (req, res) => {
  try {
    const [hospitals] = await db.query(
      'SELECT HospitalID, Name FROM Hospital'
    );
    res.render('admin/patient_form', {
      patient: {},
      hospitals,
      action: '/admin/patients'
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.createPatient = async (req, res) => {
  const { HospitalID, FirstName, LastName, DOB, Gender, Contact } = req.body;
  try {
    await db.query(
      'INSERT INTO Patient (HospitalID,FirstName,LastName,DOB,Gender,Contact) VALUES (?,?,?,?,?,?)',
      [HospitalID, FirstName, LastName, DOB, Gender, Contact]
    );
    res.redirect('/admin/patients');
  } catch (e) {
    handleError(res, e);
  }
};

exports.editPatientForm = async (req, res) => {
  const id = req.params.id;
  try {
    const [[patient]] = await db.query(
      'SELECT * FROM Patient WHERE PatientID=?',
      [id]
    );
    const [hospitals] = await db.query(
      'SELECT HospitalID, Name FROM Hospital'
    );
    res.render('admin/patient_form', {
      patient,
      hospitals,
      action: `/admin/patients/${id}`
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.updatePatient = async (req, res) => {
  const id = req.params.id;
  const { HospitalID, FirstName, LastName, DOB, Gender, Contact } = req.body;
  try {
    await db.query(
      'UPDATE Patient SET HospitalID=?,FirstName=?,LastName=?,DOB=?,Gender=?,Contact=? WHERE PatientID=?',
      [HospitalID, FirstName, LastName, DOB, Gender, Contact, id]
    );
    res.redirect('/admin/patients');
  } catch (e) {
    handleError(res, e);
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Patient WHERE PatientID=?',
      [req.params.id]
    );
    res.redirect('/admin/patients');
  } catch (e) {
    handleError(res, e);
  }
};

exports.listVisits = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, p.FirstName AS PatientFirst, u.Username AS UserName
        FROM Visit v
        LEFT JOIN Patient p ON v.PatientID = p.PatientID
        LEFT JOIN User u ON v.UserID = u.UserID
    `);
    res.render('admin/visits', { visits: rows });
  } catch (e) {
    handleError(res, e);
  }
};

exports.newVisitForm = async (req, res) => {
  try {
    const [patients] = await db.query(
      'SELECT PatientID, FirstName, LastName FROM Patient'
    );
    const [users] = await db.query(
      'SELECT UserID, Username FROM User'
    );
    res.render('admin/visit_form', {
      visit: {},
      patients,
      users,
      action: '/admin/visits'
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.createVisit = async (req, res) => {
  const { PatientID, UserID, VisitDate, Notes } = req.body;
  try {
    await db.query(
      'INSERT INTO Visit (PatientID,UserID,VisitDate,Notes) VALUES (?,?,?,?)',
      [PatientID, UserID, VisitDate, Notes]
    );
    res.redirect('/admin/visits');
  } catch (e) {
    handleError(res, e);
  }
};

exports.editVisitForm = async (req, res) => {
  const id = req.params.id;
  try {
    const [[visit]] = await db.query(
      'SELECT * FROM Visit WHERE VisitID=?',
      [id]
    );
    const [patients] = await db.query(
      'SELECT PatientID, FirstName, LastName FROM Patient'
    );
    const [users] = await db.query(
      'SELECT UserID, Username FROM User'
    );
    res.render('admin/visit_form', {
      visit,
      patients,
      users,
      action: `/admin/visits/${id}`
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateVisit = async (req, res) => {
  const id = req.params.id;
  const { PatientID, UserID, VisitDate, Notes } = req.body;
  try {
    await db.query(
      'UPDATE Visit SET PatientID=?,UserID=?,VisitDate=?,Notes=? WHERE VisitID=?',
      [PatientID, UserID, VisitDate, Notes, id]
    );
    res.redirect('/admin/visits');
  } catch (e) {
    handleError(res, e);
  }
};

exports.deleteVisit = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Visit WHERE VisitID=?',
      [req.params.id]
    );
    res.redirect('/admin/visits');
  } catch (e) {
    handleError(res, e);
  }
};

exports.listDiagnoses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, v.VisitDate, dis.Name AS DiseaseName
        FROM Diagnosis d
        LEFT JOIN Visit v ON d.VisitID = v.VisitID
        LEFT JOIN Disease dis ON d.DiseaseID = dis.DiseaseID
    `);
    res.render('admin/diagnoses', { diagnoses: rows });
  } catch (e) {
    handleError(res, e);
  }
};

exports.newDiagnosisForm = async (req, res) => {
  try {
    const [visits] = await db.query(
      'SELECT VisitID, VisitDate FROM Visit'
    );
    const [diseases] = await db.query(
      'SELECT DiseaseID, Name FROM Disease'
    );
    res.render('admin/diagnosis_form', {
      diag: {},
      visits,
      diseases,
      action: '/admin/diagnoses'
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.createDiagnosis = async (req, res) => {
  const { VisitID, DiseaseID, Severity, RiskScore } = req.body;
  try {
    await db.query(
      'INSERT INTO Diagnosis (VisitID,DiseaseID,Severity,RiskScore) VALUES (?,?,?,?)',
      [VisitID, DiseaseID, Severity, RiskScore]
    );
    res.redirect('/admin/diagnoses');
  } catch (e) {
    handleError(res, e);
  }
};

exports.editDiagnosisForm = async (req, res) => {
  const id = req.params.id;
  const [visitID, diseaseID] = id.split('-');
  try {
    const [[diag]] = await db.query(
      'SELECT * FROM Diagnosis WHERE VisitID=? AND DiseaseID=?',
      [visitID, diseaseID]
    );
    const [visits] = await db.query(
      'SELECT VisitID, VisitDate FROM Visit'
    );
    const [diseases] = await db.query(
      'SELECT DiseaseID, Name FROM Disease'
    );
    res.render('admin/diagnosis_form', {
      diag,
      visits,
      diseases,
      action: `/admin/diagnoses/${visitID}-${diseaseID}`
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateDiagnosis = async (req, res) => {
  const [visitID, diseaseID] = req.params.id.split('-');
  const { Severity, RiskScore } = req.body;
  try {
    await db.query(
      'UPDATE Diagnosis SET Severity=?,RiskScore=? WHERE VisitID=? AND DiseaseID=?',
      [Severity, RiskScore, visitID, diseaseID]
    );
    res.redirect('/admin/diagnoses');
  } catch (e) {
    handleError(res, e);
  }
};

exports.deleteDiagnosis = async (req, res) => {
  const [visitID, diseaseID] = req.params.id.split('-');
  try {
    await db.query(
      'DELETE FROM Diagnosis WHERE VisitID=? AND DiseaseID=?',
      [visitID, diseaseID]
    );
    res.redirect('/admin/diagnoses');
  } catch (e) {
    handleError(res, e);
  }
};

exports.listDiseases = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Disease');
    res.render('admin/diseases', { diseases: rows });
  } catch (e) {
    handleError(res, e);
  }
};

exports.newDiseaseForm = (req, res) => {
  res.render('admin/disease_form', {
    disease: {},
    action: '/admin/diseases'
  });
};

exports.createDisease = async (req, res) => {
  const { Name, Description } = req.body;
  try {
    await db.query(
      'INSERT INTO Disease (Name,Description) VALUES (?,?)',
      [Name, Description]
    );
    res.redirect('/admin/diseases');
  } catch (e) {
    handleError(res, e);
  }
};

exports.editDiseaseForm = async (req, res) => {
  const id = req.params.id;
  try {
    const [[disease]] = await db.query(
      'SELECT * FROM Disease WHERE DiseaseID=?',
      [id]
    );
    res.render('admin/disease_form', {
      disease,
      action: `/admin/diseases/${id}`
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateDisease = async (req, res) => {
  const id = req.params.id;
  const { Name, Description } = req.body;
  try {
    await db.query(
      'UPDATE Disease SET Name=?,Description=? WHERE DiseaseID=?',
      [Name, Description, id]
    );
    res.redirect('/admin/diseases');
  } catch (e) {
    handleError(res, e);
  }
};

exports.deleteDisease = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Disease WHERE DiseaseID=?',
      [req.params.id]
    );
    res.redirect('/admin/diagnoses');
  } catch (e) {
    handleError(res, e);
  }
};

exports.listHospitals = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Hospital');
    res.render('admin/hospitals', { hospitals: rows });
  } catch (e) {
    handleError(res, e);
  }
};

exports.newHospitalForm = (req, res) => {
  res.render('admin/hospital_form', {
    hospital: {},
    action: '/admin/hospitals'
  });
};

exports.createHospital = async (req, res) => {
  const { Name, Address, Type, ZipCode, Rating } = req.body;
  try {
    await db.query(
      'INSERT INTO Hospital (Name,Address,Type,ZipCode,Rating) VALUES (?,?,?,?,?)',
      [Name, Address, Type, ZipCode, Rating]
    );
    res.redirect('/admin/hospitals');
  } catch (e) {
    handleError(res, e);
  }
};

exports.editHospitalForm = async (req, res) => {
  const id = req.params.id;
  try {
    const [[hospital]] = await db.query(
      'SELECT * FROM Hospital WHERE HospitalID=?',
      [id]
    );
    res.render('admin/hospital_form', {
      hospital,
      action: `/admin/hospitals/${id}`
    });
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateHospital = async (req, res) => {
  const id = req.params.id;
  const { Name, Address, Type, ZipCode, Rating } = req.body;
  try {
    await db.query(
      'UPDATE Hospital SET Name=?,Address=?,Type=?,ZipCode=?,Rating=? WHERE HospitalID=?',
      [Name, Address, Type, ZipCode, Rating, id]
    );
    res.redirect('/admin/hospitals');
  } catch (e) {
    handleError(res, e);
  }
};

exports.deleteHospital = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Hospital WHERE HospitalID=?',
      [req.params.id]
    );
    res.redirect('/admin/hospitals');
  } catch (e) {
    handleError(res, e);
  }
};

// Search-enabled lists below (same two-space indentation)

exports.listUsers = async (req, res) => {
  try {
    const q = req.query.q || '';
    const search = `%${q}%`;
    const [rows] = await db.query(
      `
      SELECT * FROM User
       WHERE Username LIKE ? OR Email LIKE ? OR Role LIKE ?
      `,
      [search, search, search]
    );
    res.render('admin/users', { users: rows, q });
  } catch (e) {
    handleError(res, e);
  }
};

exports.listPatients = async (req, res) => {
  try {
    const q = req.query.q || '';
    const search = `%${q}%`;
    const [rows] = await db.query(
      `
      SELECT
         p.*,
         h.Name        AS HospitalName,
         p.AvgRiskScore
       FROM Patient p
       LEFT JOIN Hospital h
         ON p.HospitalID = h.HospitalID
       WHERE p.FirstName LIKE ?
         OR p.LastName  LIKE ?
         OR h.Name      LIKE ?
      `,
      [search, search, search]
    );
    res.render('admin/patients', { patients: rows, q });
  } catch (e) {
    handleError(res, e);
  }
};

exports.listVisits = async (req, res) => {
  try {
    const q = req.query.q || '';
    const search = `%${q}%`;
    const [rows] = await db.query(
      `
      SELECT v.*, p.FirstName AS PatientFirst, u.Username AS UserName
       FROM Visit v
       LEFT JOIN Patient p ON v.PatientID = p.PatientID
       LEFT JOIN User u ON v.UserID = u.UserID
       WHERE p.FirstName LIKE ? OR u.Username LIKE ? OR v.Notes LIKE ?
      `,
      [search, search, search]
    );
    res.render('admin/visits', { visits: rows, q });
  } catch (e) {
    handleError(res, e);
  }
};

exports.listDiagnoses = async (req, res) => {
  try {
    const q = req.query.q || '';
    const search = `%${q}%`;
    const [rows] = await db.query(
      `
      SELECT d.*, v.VisitDate, dis.Name AS DiseaseName
       FROM Diagnosis d
       LEFT JOIN Visit v ON d.VisitID = v.VisitID
       LEFT JOIN Disease dis ON d.DiseaseID = dis.DiseaseID
       WHERE dis.Name LIKE ? OR d.Severity LIKE ?
      `,
      [search, search]
    );
    res.render('admin/diagnoses', { diagnoses: rows, q });
  } catch (e) {
    handleError(res, e);
  }
};

exports.listDiseases = async (req, res) => {
  try {
    const q = req.query.q || '';
    const search = `%${q}%`;
    const [rows] = await db.query(
      `
      SELECT * FROM Disease
       WHERE Name LIKE ? OR Description LIKE ?
      `,
      [search, search]
    );
    res.render('admin/diseases', { diseases: rows, q });
  } catch (e) {
    handleError(res, e);
  }
};

exports.listHospitals = async (req, res) => {
  try {
    const q = req.query.q || '';
    const search = `%${q}%`;
    const [rows] = await db.query(
      `
      SELECT * FROM Hospital
       WHERE Name LIKE ? OR Address LIKE ? OR Type LIKE ? OR ZipCode LIKE ?
      `,
      [search, search, search, search]
    );
    res.render('admin/hospitals', { hospitals: rows, q });
  } catch (e) {
    handleError(res, e);
  }
};

//combined‐reports transaction
exports.combinedReports = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await conn.query('BEGIN');

    //Our Advanced Query #1: Top diabetes patients
    const [diabetesRows] = await conn.query(`
      SELECT 
        p.PatientID,
        p.FirstName,
        p.LastName,
        COUNT(d.DiseaseID) AS DiabetesCount
      FROM Patient p
      JOIN Visit v ON p.PatientID = v.PatientID
      JOIN Diagnosis d ON v.VisitID   = d.VisitID
      WHERE d.DiseaseID = 1
        AND d.RiskScore > 5
        AND d.Severity  IN ('Moderate','Severe')
        AND v.VisitDate BETWEEN '2004-01-01' AND '2024-12-31'
      GROUP BY p.PatientID, p.FirstName, p.LastName
      HAVING COUNT(d.DiseaseID) >= 2
      ORDER BY DiabetesCount DESC
      LIMIT 15
    `);

    //Our Advanced Query #2: Hospitals by diseased‐patient count
    const [diseasedRows] = await conn.query(`
      SELECT 
        h.Name,
        COUNT(DISTINCT p.PatientID) AS DiseasedPatientCount
      FROM Hospital h
      JOIN Patient p ON h.HospitalID = p.HospitalID
      JOIN Visit v ON p.PatientID   = v.PatientID
      JOIN Diagnosis d ON v.VisitID     = d.VisitID
      WHERE h.Rating > 2
        AND d.RiskScore > 3
        AND v.VisitDate > '2000-01-01'
      GROUP BY h.HospitalID, h.Name
      ORDER BY DiseasedPatientCount DESC
      LIMIT 15
    `);

    await conn.query('COMMIT');
    res.render('admin/combined_reports', {
      diabetesRows,
      diseasedRows
    });
  } catch (err) {
    await conn.query('ROLLBACK');
    handleError(res, err);
  } finally {
    conn.release();
  }
};

//overview report (stored procedure)
exports.runOverviewReport = async (req, res) => {
  try {
    //array of result‐sets
    const [rowsSets] = await db.query('CALL GetOverviewReport(?)', [1]);
    const patientReport  = rowsSets[0];
    //could be 0 if flag
    const hospitalReport = rowsSets[1] || [];  

    res.render('admin/overview_report', {
      patientReport,
      hospitalReport
    });
  } catch (err) {
    handleError(res, err);
  }
};

//dashboard view (data for graph + numbers)
exports.dashboard = async (req, res) => {
  try {
    const [[{totalPatients}]] = await db.query(
      'SELECT COUNT(*) AS totalPatients FROM Patient'
    );
    const [[{activeVisits}]] = await db.query(`
      SELECT COUNT(*) AS activeVisits
      FROM Visit
      WHERE VisitDate >= CURDATE() - INTERVAL 30 DAY
    `);
    const [[{totalHospitals}]] = await db.query(
      'SELECT COUNT(*) AS totalHospitals FROM Hospital'
    );
    const [[{systemUsers}]]= await db.query(
      'SELECT COUNT(*) AS systemUsers FROM User'
    );

    const [visitsPerMonth] = await db.query(`
      SELECT
        DATE_FORMAT(VisitDate, '%Y-%m') AS month,
        COUNT(*) AS count
      FROM Visit
      WHERE VisitDate >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)
      GROUP BY month
      ORDER BY month
    `);

    const [sevRows] = await db.query(`
      SELECT Severity, COUNT(*) AS count
      FROM Diagnosis
      GROUP BY Severity
    `);
    const severityCounts = sevRows.reduce((acc, row) => {
      acc[row.Severity] = row.count;
      return acc;
    }, {});

    res.render('admin/dashboard', {
      totalPatients,
      activeVisits,
      totalHospitals,
      systemUsers,
      visitsPerMonth,
      severityCounts
    });
  } catch (e) {
    handleError(res, e);
  }
};
