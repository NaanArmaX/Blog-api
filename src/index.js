require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API rodando! Use o endpoint /api/v1 para acessar a API.'
  });
});

const v1Routes = require('./routes/v1');
app.use('/api/v1', v1Routes);

module.exports = app;
