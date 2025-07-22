const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  console.log('authenticating', req.headers) // Log header để debug
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    console.log('Không có token')
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Token verify lỗi:', err)
        return res.status(403).json({ message: 'Forbidden' })
      }
      req.user = user
      console.log('Token hợp lệ, user:', user)
      next()
    })
  } catch (err) {
    console.error('Lỗi authenticateToken:', err) // Log lỗi nếu có
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authenticateToken
