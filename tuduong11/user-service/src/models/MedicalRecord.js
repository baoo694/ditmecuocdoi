const mongoose = require('mongoose')

const MedicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    diagnosis: { type: String, required: true }, // Chẩn đoán
    treatment: { type: String }, // Phác đồ điều trị
    notes: { type: String }, // Ghi chú thêm
    attachments: [{ type: String }], // Link file, ảnh, xét nghiệm
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema)
