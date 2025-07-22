const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./src/models/User')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/chat-app' // sửa lại tên DB nếu cần

async function createUsers() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  // 1. Tạo admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await User.create({
    username: 'admin1',
    email: 'admin1@example.com',
    password: adminPassword,
    role: 'admin',
    isVerified: true,
  })
  console.log('Admin:', admin)

  // 2. Tạo bác sĩ
  const doctorPassword = await bcrypt.hash('doctor123', 10)
  const doctor = await User.create({
    username: 'doctor1',
    email: 'doctor1@example.com',
    password: doctorPassword,
    role: 'doctor',
    isVerified: true,
    createdBy: admin._id,
    doctorInfo: {
      specialization: 'Nội tổng quát',
      licenseNumber: 'BS123456',
      department: 'Khoa Nội',
      phoneNumber: '0123456789',
    },
  })
  console.log('Doctor:', doctor)

  // 3. Tạo bệnh nhân
  const patientPassword = await bcrypt.hash('patient123', 10)
  const patient = await User.create({
    username: 'patient1',
    email: 'patient1@example.com',
    password: patientPassword,
    role: 'patient',
    isVerified: true,
    createdBy: admin._id,
    patientInfo: {
      phoneNumber: '0987654321',
      address: 'Hà Nội',
      emergencyContact: '0123456789',
    },
  })
  console.log('Patient:', patient)

  await mongoose.disconnect()
}

createUsers().catch((err) => {
  console.error(err)
  process.exit(1)
})
