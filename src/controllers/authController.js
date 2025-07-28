const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { blacklistToken } = require('../services/tokenBlacklist')

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET

exports.register = async (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email já está em uso.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER'
      },
    })

    return res.status(201).json({ message: 'Usuário registrado com sucesso.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao registrar usuário.' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email ,role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({ token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao fazer login.' })
  }
}

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido.' })
    }

    const decoded = jwt.decode(token)
    if (!decoded?.exp) {
      return res.status(400).json({ error: 'Token inválido.' })
    }

    const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000)
    if (expiresInSeconds > 0) {
      await blacklistToken(token, expiresInSeconds)
    }

    return res.json({ message: 'Logout realizado com sucesso.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao fazer logout.' })
  }
}

exports.changePassword = async (req, res) => {
  const userId = req.user.userId; // pegando do token (middleware)
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Senhas são obrigatórias.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return res.json({ message: 'Senha alterada com sucesso.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
};