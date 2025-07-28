const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware.js');
const authorizeRole = require('../../middlewares/authorizeRole.js');

router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Você está autenticado!',
    user: req.user
  });
});

router.get('/admin-only', authenticateToken, authorizeRole('ADMIN'), (req, res) => {
  res.json({ message: 'Bem-vindo, admin!' });
});

router.get('/user-or-admin', authenticateToken, authorizeRole('USER', 'ADMIN'), (req, res) => {
  res.json({ message: 'Bem-vindo, usuário ou admin!' });
});



module.exports = router;
