# Finances Node API

API REST para gerenciamento de empresas, usuários e autenticação.
Construída com Express 5, TypeScript, Prisma e MongoDB.

> **Status:** em desenvolvimento. A base do servidor e a documentação
> OpenAPI já estão prontas. Os endpoints de negócio e a conexão com o
> banco de dados ainda serão implementados.

---

## Tecnologias

| Camada         | Ferramenta               |
| -------------- | ------------------------ |
| Runtime        | Node.js 22+ (ESM)        |
| Linguagem      | TypeScript 6             |
| Framework HTTP | Express 5                |
| Banco de dados | MongoDB                  |
| ORM            | Prisma 6.19              |
| Validação      | Zod 4                    |
| Autenticação   | JSON Web Token + bcrypt  |
| Documentação   | OpenAPI 3.0 + Swagger UI |
| Qualidade      | ESLint, Prettier, Husky  |

---

## Pré-requisitos

- **Node.js 22 ou superior** e npm
- **MongoDB em replica set** — necessário para a camada de banco de dados.
  O Prisma não conecta em uma instância standalone. Use o
  [MongoDB Atlas](https://www.mongodb.com/atlas), que já vem configurado
  como replica set, ou configure um replica set local.

---

## Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/lab05-juniando/lab05-nodejs.git
cd lab05-nodejs

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env na raiz do projeto
#    (veja a seção "Variáveis de ambiente" abaixo)

# 4. Suba o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=3000
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/finances"
```

| Variável       | Descrição                                  | Exemplo                                                 |
| -------------- | ------------------------------------------ | ------------------------------------------------------- |
| `PORT`         | Porta HTTP do servidor                     | `3000`                                                  |
| `DATABASE_URL` | String de conexão do MongoDB (replica set) | `mongodb+srv://user:senha@cluster.mongodb.net/finances` |

O arquivo `.env` não é versionado.

> O `PORT` não possui valor padrão no código. Se a variável não for
> definida, o Node atribui uma porta aleatória e o log exibe
> `SERVER RODANDO NA PORTA: undefined`.

---

## Scripts disponíveis

| Script                 | O que faz                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Sobe o servidor com hot reload (`tsx watch`)       |
| `npm run build`        | Compila o TypeScript para `dist/`                  |
| `npm start`            | Executa a build de produção (`dist/src/server.js`) |
| `npm run lint`         | Analisa o código com ESLint                        |
| `npm run lint:fix`     | Corrige automaticamente o que o ESLint conseguir   |
| `npm run format`       | Formata o projeto com Prettier                     |
| `npm run format:check` | Verifica a formatação sem alterar arquivos         |

---

## Documentação da API

Com o servidor rodando:

- **Swagger UI:** http://localhost:3000/docs
- **Spec OpenAPI (JSON):** http://localhost:3000/docs.json

A especificação é mantida manualmente em `src/docs/swagger.ts` e servida
pelo `swagger-ui-express`. O endpoint `/docs.json` pode ser importado
diretamente no Postman ou no Insomnia.

A autenticação está declarada no schema `bearerAuth` (JWT no header
`Authorization`), disponível pelo botão **Authorize** na interface.

### Rotas atuais

| Método | Rota         | Descrição                     |
| ------ | ------------ | ----------------------------- |
| `GET`  | `/`          | Healthcheck                   |
| `GET`  | `/docs`      | Interface do Swagger UI       |
| `GET`  | `/docs.json` | Especificação OpenAPI em JSON |

Os endpoints de autenticação, usuários e empresas ainda não foram
implementados.

---

## Modelo de dados

Os modelos estão definidos em `prisma/schema.prisma`.

### `User`

| Campo       | Tipo       | Restrições                               |
| ----------- | ---------- | ---------------------------------------- |
| `id`        | `String`   | PK, ObjectId, gerado automaticamente     |
| `name`      | `String`   | Obrigatório                              |
| `email`     | `String`   | Obrigatório, único                       |
| `password`  | `String`   | Obrigatório, armazenado com hash bcrypt  |
| `role`      | `Role`     | Padrão: `ADMIN`                          |
| `companyId` | `String`   | FK para `Company`, único                 |
| `createdAt` | `DateTime` | Preenchido na criação                    |
| `updatedAt` | `DateTime` | Atualizado automaticamente               |
| `deletedAt` | `DateTime` | Opcional — usado para exclusão lógica    |

### `Company`

| Campo       | Tipo       | Restrições                           |
| ----------- | ---------- | ------------------------------------ |
| `id`        | `String`   | PK, ObjectId, gerado automaticamente |
| `name`      | `String`   | Obrigatório                          |
| `cnpj`      | `String`   | Opcional, único quando informado     |
| `createdAt` | `DateTime` | Preenchido na criação                |
| `updatedAt` | `DateTime` | Atualizado automaticamente           |

### `Role` (enum)

`ADMIN` · `USER`

### Relacionamento

`User` e `Company` possuem relação **1:1**. O campo `companyId` é único,
portanto cada empresa possui no máximo um usuário vinculado.

> O MongoDB não utiliza migrations no Prisma. A sincronização do schema
> com o banco é feita com `prisma db push`, e não com `prisma migrate`.

---

## Estrutura do projeto

```
.
├── .github/workflows/   # Pipeline de deploy (GitHub Actions)
├── .husky/              # Git hooks
├── prisma/
│   └── schema.prisma    # Modelos e configuração do banco
├── src/
│   ├── docs/
│   │   └── swagger.ts   # Especificação OpenAPI
│   └── server.ts        # Ponto de entrada da aplicação
├── prisma.config.ts
├── tsconfig.json
└── package.json
```

---

## Padrões de código

O projeto usa **ESLint** para análise estática e **Prettier** para
formatação. Um hook de `pre-commit` (Husky) roda `lint` e `format`
automaticamente antes de cada commit.

Regras do Prettier: aspas duplas, ponto e vírgula, indentação de 2
espaços, largura máxima de 100 colunas e vírgula final.

---

## Deploy

O deploy é automático via **GitHub Actions**. Todo push na branch `main`
dispara o workflow `.github/workflows/deploy.yml`, que conecta por SSH ao
servidor na Oracle Cloud e executa:

```bash
git pull
npm install
npm run build
pm2 restart lab05-nodejs
```

### Secrets necessários no repositório

| Secret           | Descrição                           |
| ---------------- | ----------------------------------- |
| `ORACLE_HOST`    | Endereço do servidor                |
| `ORACLE_USER`    | Usuário SSH                         |
| `ORACLE_SSH_KEY` | Chave privada SSH para autenticação |

---

## Licença

ISC
