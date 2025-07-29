const app = require('../src/index.js');

const PORT = process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
  console.log(`API v1 rodando em http://localhost:${PORT}/api/v1`);
});
