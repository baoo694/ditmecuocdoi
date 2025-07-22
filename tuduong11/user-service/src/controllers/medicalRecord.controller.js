const MedicalRecord = require('../models/MedicalRecord')
const User = require('../models/User')

// Tạo hồ sơ bệnh án mới (bác sĩ)
exports.createMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, treatment, notes, attachments } = req.body
    const doctorId = req.user.id
    // Kiểm tra quyền bác sĩ (có thể bổ sung kiểm tra phụ trách bệnh nhân)
    const doctor = await User.findById(doctorId)
    if (!doctor || doctor.role !== 'doctor') {
      return res
        .status(403)
        .json({ message: 'Only doctor can create medical record' })
    }
    const record = await MedicalRecord.create({
      patientId,
      doctorId,
      diagnosis,
      treatment,
      notes,
      attachments,
    })
    res.status(201).json({ message: 'Medical record created', record })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating medical record', error: err.toString() })
  }
}

// Sửa hồ sơ bệnh án (bác sĩ)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const doctorId = req.user.id
    const { recordId } = req.params
    const updateData = req.body
    const record = await MedicalRecord.findById(recordId)
    if (!record) return res.status(404).json({ message: 'Record not found' })
    if (record.doctorId.toString() !== doctorId) {
      return res
        .status(403)
        .json({ message: 'Only the doctor who created can update this record' })
    }
    Object.assign(record, updateData, { updatedAt: new Date() })
    await record.save()
    res.json({ message: 'Medical record updated', record })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating medical record', error: err.toString() })
  }
}

// Xóa hồ sơ bệnh án (bác sĩ)
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const doctorId = req.user.id
    const { recordId } = req.params
    const record = await MedicalRecord.findById(recordId)
    if (!record) return res.status(404).json({ message: 'Record not found' })
    if (record.doctorId.toString() !== doctorId) {
      return res
        .status(403)
        .json({ message: 'Only the doctor who created can delete this record' })
    }
    record.status = 'deleted'
    await record.save()
    res.json({ message: 'Medical record deleted (soft)', record })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting medical record', error: err.toString() })
  }
}

// Lấy danh sách hồ sơ bệnh án của bệnh nhân (bác sĩ, bệnh nhân, admin)
exports.getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params
    const user = await User.findById(req.user.id)
    if (!user) return res.status(403).json({ message: 'Unauthorized' })
    // Bệnh nhân chỉ xem hồ sơ của mình
    if (user.role === 'patient' && user._id.toString() !== patientId) {
      return res
        .status(403)
        .json({ message: 'You can only view your own records' })
    }
    // Bác sĩ chỉ xem hồ sơ của bệnh nhân mình phụ trách (có thể bổ sung kiểm tra)
    // Admin xem tất cả
    const records = await MedicalRecord.find({
      patientId,
      status: { $ne: 'deleted' },
    }).populate('doctorId', 'username email')
    res.json({ records })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching records', error: err.toString() })
  }
}

// Lấy chi tiết hồ sơ bệnh án
exports.getRecordById = async (req, res) => {
  try {
    const { recordId } = req.params
    const record = await MedicalRecord.findById(recordId)
      .populate('doctorId', 'username email')
      .populate('patientId', 'username email')
    if (!record || record.status === 'deleted')
      return res.status(404).json({ message: 'Record not found' })
    const user = await User.findById(req.user.id)
    if (!user) return res.status(403).json({ message: 'Unauthorized' })
    // Bệnh nhân chỉ xem hồ sơ của mình
    if (
      user.role === 'patient' &&
      record.patientId._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'You can only view your own records' })
    }
    // Bác sĩ chỉ xem hồ sơ mình tạo (có thể mở rộng)
    if (
      user.role === 'doctor' &&
      record.doctorId._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'You can only view records you created' })
    }
    res.json({ record })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching record', error: err.toString() })
  }
}

// Thống kê hồ sơ bệnh án (admin)
exports.getStatistics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view statistics' })
    }
    const total = await MedicalRecord.countDocuments({
      status: { $ne: 'deleted' },
    })
    const byDoctor = await MedicalRecord.aggregate([
      { $match: { status: { $ne: 'deleted' } } },
      { $group: { _id: '$doctorId', count: { $sum: 1 } } },
    ])
    const byPatient = await MedicalRecord.aggregate([
      { $match: { status: { $ne: 'deleted' } } },
      { $group: { _id: '$patientId', count: { $sum: 1 } } },
    ])
    res.json({ total, byDoctor, byPatient })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching statistics', error: err.toString() })
  }
}

exports.getAllRecords = async (req, res) => {
  console.log('Vào getAllRecords', req.user)
  try {
    const user = await User.findById(req.user.id)
    if (!user || user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only admin can view all records' })
    }
    // Populate cả doctorId và patientId
    const records = await MedicalRecord.find({ status: { $ne: 'deleted' } })
      .populate('doctorId', 'username email')
      .populate('patientId', 'username email')
    res.json({ records })
  } catch (err) {
    console.error('Lỗi getAllRecords:', err)
    res
      .status(500)
      .json({ message: 'Error fetching all records', error: err.toString() })
  }
}
