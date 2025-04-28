const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');

router.get('/', ctrl.dashboard);
router.get('/users', ctrl.listUsers);
router.get('/users/new', ctrl.newUserForm);
router.post('/users', ctrl.createUser);
router.get('/users/:id/edit', ctrl.editUserForm);
router.post('/users/:id', ctrl.updateUser);
router.post('/users/:id/delete', ctrl.deleteUser);

router.get('/patients', ctrl.listPatients);
router.get('/patients/new',ctrl.newPatientForm);
router.post('/patients', ctrl.createPatient);
router.get('/patients/:id/edit', ctrl.editPatientForm);
router.post('/patients/:id',ctrl.updatePatient);
router.post('/patients/:id/delete', ctrl.deletePatient);

router.get('/visits',ctrl.listVisits);
router.get('/visits/new', ctrl.newVisitForm);
router.post('/visits', ctrl.createVisit);
router.get('/visits/:id/edit', ctrl.editVisitForm);
router.post('/visits/:id',ctrl.updateVisit);
router.post('/visits/:id/delete', ctrl.deleteVisit);

router.get('/diagnoses', ctrl.listDiagnoses);
router.get('/diagnoses/new',ctrl.newDiagnosisForm);
router.post('/diagnoses', ctrl.createDiagnosis);
router.get('/diagnoses/:id/edit', ctrl.editDiagnosisForm);
router.post('/diagnoses/:id',ctrl.updateDiagnosis);
router.post('/diagnoses/:id/delete', ctrl.deleteDiagnosis);

router.get('/diseases', ctrl.listDiseases);
router.get('/diseases/new', ctrl.newDiseaseForm);
router.post('/diseases', ctrl.createDisease);
router.get('/diseases/:id/edit', ctrl.editDiseaseForm);
router.post('/diseases/:id',ctrl.updateDisease);
router.post('/diseases/:id/delete', ctrl.deleteDisease);

router.get('/hospitals', ctrl.listHospitals);
router.get('/hospitals/new',ctrl.newHospitalForm);
router.post('/hospitals', ctrl.createHospital);
router.get('/hospitals/:id/edit', ctrl.editHospitalForm);
router.post('/hospitals/:id',ctrl.updateHospital);
router.post('/hospitals/:id/delete',ctrl.deleteHospital);

router.post('/reports/combined', ctrl.combinedReports);

router.post('/reports/overview', ctrl.runOverviewReport);

module.exports = router;
