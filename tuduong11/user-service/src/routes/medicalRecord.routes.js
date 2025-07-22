const express = require('express')
const router = express.Router()
const medicalRecordController = require('../controllers/medicalRecord.controller')
const authenticateToken = require('../middlewares/auth')

// Tạo hồ sơ bệnh án (bác sĩ)
router.post('/', authenticateToken, medicalRecordController.createMedicalRecord)
// Sửa hồ sơ bệnh án (bác sĩ)
router.put(
  '/:recordId',
  authenticateToken,
  medicalRecordController.updateMedicalRecord
)
// Xóa hồ sơ bệnh án (bác sĩ)
router.delete(
  '/:recordId',
  authenticateToken,
  medicalRecordController.deleteMedicalRecord
)
// Lấy danh sách hồ sơ bệnh án của bệnh nhân (bác sĩ, bệnh nhân, admin)
router.get(
  '/patient/:patientId',
  authenticateToken,
  medicalRecordController.getPatientRecords
)
// Lấy tất cả hồ sơ bệnh án (admin)
router.get('/all', authenticateToken, async (req, res, next) => {
  try {
    console.log('Route /all đã được gọi')
    await medicalRecordController.getAllRecords(req, res, next)
  } catch (err) {
    console.error('Lỗi ở route /all:', err)
    res.status(500).json({ message: 'Lỗi ở route /all', error: err.toString() })
  }
})
// Lấy chi tiết hồ sơ bệnh án
router.get(
  '/:recordId',
  authenticateToken,
  medicalRecordController.getRecordById
)
// Thống kê hồ sơ bệnh án (admin)
router.get(
  '/statistics/all',
  authenticateToken,
  medicalRecordController.getStatistics
)

module.exports = router
