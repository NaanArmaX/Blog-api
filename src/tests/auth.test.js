const axios = require('axios');

describe('Autenticação', () => {
  let userEmail;
  const userPassword = '123456';
  let token;

  beforeAll(async () => {
   
    userEmail = `teste${Date.now()}@email.com`;

    await axios.post('http://localhost:3000/api/v1/auth/register', {
      email: userEmail,
      name: 'Usuário Teste',
      password: userPassword
    });

    const loginResponse = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: userEmail,
      password: userPassword
    });

    token = loginResponse.data.token;
  });

  it('deve registrar um novo usuário', async () => {
    expect(token).toBeDefined();
  });

  it('deve fazer login com usuário válido', async () => {
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: userEmail,
      password: userPassword
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
  });

  it('não deve logar com senha errada', async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/auth/login', {
        email: userEmail,
        password: 'senhaErrada'
      });
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('error', 'Credenciais inválidas.');
    }
  });

  it('deve acessar rota protegida com token válido', async () => {
    const response = await axios.get('http://localhost:3000/api/v1/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'Você está autenticado!');
    expect(response.data.user).toHaveProperty('email', userEmail);
  });

  it('não deve acessar rota protegida sem token', async () => {
    try {
      await axios.get('http://localhost:3000/api/v1/profile');
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('error');
    }
  });

  it('não deve registrar com campos vazios', async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/auth/register', {
        email: '',
        name: '',
        password: ''
      });
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error');
    }
});

it('não deve registrar com email já existente', async () => {
    const existingEmail = `duplicado${Date.now()}@email.com`;

    
    const res = await axios.post('http://localhost:3000/api/v1/auth/register', {
      email: existingEmail,
      name: 'Duplicado',
      password: '123456'
    });
    expect(res.status).toBe(201);

    
    try {
      await axios.post('http://localhost:3000/api/v1/auth/register', {
        email: existingEmail,
        name: 'Duplicado',
        password: '123456'
      });
    } catch (error) {
      expect(error.response.status).toBe(409); 
      expect(error.response.data).toHaveProperty('error');
    }
  });

});

