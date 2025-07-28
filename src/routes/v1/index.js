const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const protectedRoutes = require('./protected'); 
const postRoutes = require('./post')  


router.use('/auth', authRoutes);        
router.use('/', protectedRoutes);     
router.use('/posts', postRoutes)

router.get('/ping', (req, res) => {
  res.json({ message: 'pong v1' });
});

module.exports = router;
