const express = require('express')
const router = express.Router()

const authRoutes = require('./auth')
const protectedRoutes = require('./protected')
const postRoutes = require('./post')

router.get('/', (req, res) => {
  res.json({
    message: 'API Blog - Bem-vindo!',
    version: '1.0.0',
    docs: 'https://documenter.getpostman.com/view/11781973/2sB3B7PZUB'
  })
})

router.use('/auth', authRoutes)
router.use('/posts', postRoutes)
router.use('/', protectedRoutes)

router.get('/ping', (req, res) => {
  res.json({ message: 'pong v1' })
})

module.exports = router
