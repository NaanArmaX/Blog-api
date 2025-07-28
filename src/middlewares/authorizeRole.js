
module.exports = function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;

    console.log(req.user.role)

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }

    next();
  };
};
