require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.routes')
const medicalRecordRoutes = require('./routes/medicalRecord.routes')
const cors = require('cors')

const app = express()
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
)
app.use(express.json())

// Chỉ kết nối MongoDB nếu **không phải môi trường test**
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected for User Service...'))
    .catch((err) => console.error('MongoDB connection error:', err))
}

// Định nghĩa routes
// server.js của User Service
app.use('/users', userRoutes)
app.use('/medical-records', medicalRecordRoutes)

const port = process.env.PORT || 3001

// Không khởi động server nếu đang chạy test
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`User Service started on port ${port}`)
  })
}

module.exports = app
