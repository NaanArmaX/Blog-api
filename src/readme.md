# Blog API

Backend API REST para gerenciamento de usuários e posts com autenticação JWT, controle de roles (admin/user) e CRUD completo para posts.

---

## Tecnologias

- Node.js + Express
- Prisma ORM
- PostgreSQL

---

## Endpoints da API

### Autenticação e Usuários

#### Registro de usuário
```
POST /api/v1/register
```
**Body:**
| Campo       | Tipo   | Descrição                     |
|-------------|--------|-------------------------------|
| email       | string | Obrigatório. Email do usuário |
| password    | string | Obrigatório. Senha do usuário |
| name        | string | Opcional. Nome do usuário     |

#### Login
```
POST /api/v1/login
```
**Body:**
| Campo       | Tipo   | Descrição                     |
|-------------|--------|-------------------------------|
| email       | string | Obrigatório. Email do usuário |
| password    | string | Obrigatório. Senha do usuário |

**Resposta:**
```json
{
  "token": "seu_jwt_token_aqui"
}
```

#### Trocar senha (autenticado)
```
POST /api/v1/change-password
```
**Headers:**
```
Authorization: Bearer <token>
```
**Body:**
| Campo       | Tipo   | Descrição                     |
|-------------|--------|-------------------------------|
| oldPassword | string | Obrigatório. Senha atual      |
| newPassword | string | Obrigatório. Nova senha       |

### Posts

*Todas as rotas abaixo requerem autenticação (header `Authorization: Bearer <token>`).*

#### Criar post
```
POST /api/v1/posts
```
**Body:**
| Campo       | Tipo   | Descrição                     |
|-------------|--------|-------------------------------|
| title       | string | Obrigatório. Título do post   |
| content     | string | Obrigatório. Conteúdo do post |

#### Listar posts
```
GET /api/v1/posts
```
Retorna lista de posts com dados do autor.

#### Buscar post por ID
```
GET /api/v1/posts/{id}
```
**Parâmetro:**
| Parâmetro | Tipo | Descrição                     |
|-----------|------|-------------------------------|
| id        | int  | Obrigatório. ID do post       |

#### Atualizar post
```
PUT /api/v1/posts/{id}
```
**Body:**
| Campo       | Tipo    | Descrição                        |
|-------------|---------|----------------------------------|
| title       | string  | Opcional. Novo título do post    |
| content     | string  | Opcional. Novo conteúdo do post  |
| published   | boolean | Opcional. Status de publicação   |

**Permissão:** Somente autor do post ou usuário com role ADMIN.

#### Deletar post
```
DELETE /api/v1/posts/{id}
```
**Permissão:** Somente autor do post ou usuário com role ADMIN.

### Rotas com Controle de Roles
| Método | Rota                  | Descrição                          | Roles autorizadas |
|--------|-----------------------|------------------------------------|-------------------|
| GET    | /api/v1/admin-only    | Acesso exclusivo para admins       | ADMIN             |
| GET    | /api/v1/user-or-admin | Acesso para usuários e admins      | USER, ADMIN       |

---

## Configuração do Ambiente

Crie o arquivo `.env` na raiz do projeto:
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=sua_chave_secreta
BACKEND_PORT=3000
REDIS_URL=redis://localhost:6379
```

---

## Rodando a Aplicação

### Rodando com Docker Compose
```bash
docker-compose up --build
```

### Migrations e Prisma Client
Execute para criar as tabelas e gerar cliente Prisma:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Rodar servidor localmente
```bash
npm run dev
```

---

## Testes via Postman

Use o header `Authorization: Bearer <token>` para todas rotas que requerem autenticação.

1. Teste o login, copie o token e envie nos headers das requisições subsequentes.

---

## Estrutura da API

```mermaid
graph LR
  subgraph Auth Service
    A1[Auth Service] -->|Banco de dados| DB[(PostgreSQL)]
    A1 -->|Geração de Token| JWT[(JWT)]
    A1 -->|Cache| REDIS[(Redis)]
  end

  subgraph Posts Service
    P1[Posts Service] -->|CRUD Posts| DB
    P1 -->|Autenticação e Roles| A1
  end

  DB -->|Compartilhado| REDIS
```

---

## Considerações Finais

- Senhas são armazenadas com bcrypt (hash seguro)
- Tokens JWT contêm informações do usuário e roles para controle de acesso
- Middleware para autenticação e autorização controlam acesso às rotas protegidas
- Prisma ORM facilita a manipulação do banco de dados PostgreSQL
- Utilize variáveis de ambiente para segredos e configurações