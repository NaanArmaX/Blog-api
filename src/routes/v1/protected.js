const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware.js');


router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Você está autenticado!',
    user: req.user
  });
});

module.exports = router;
