require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

const PORT = process.env.BACKEND_PORT || 3000


const v1Routes = require('./routes/v1')
app.use('/api/v1', v1Routes)

app.listen(PORT, () => {
  console.log(`API v1 rodando em http://localhost:${PORT}/api/v1`)
})
