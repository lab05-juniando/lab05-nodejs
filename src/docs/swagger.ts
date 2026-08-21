export const swaggerDocs = {
  openapi: "3.0.4",

  info: {
    title: "Finances Node API",
    version: "1.0.0",
    description: "API REST para gerenciamento de usuários e autenticação.",
  },

  servers: [{ url: "http://localhost:3000", description: "Ambiente de desenvolvimento local" }],

  tags: [
    { name: "Auth", description: "Autenticação e emissão de tokens" },
    { name: "Users", description: "Gerenciamento de usuários" },
    { name: "Companies", description: "Gerenciamento de empresas" },
    { name: "Settings", description: "Preferências do usuário e configuração da empresa" },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Informe o token JWT retornado pelo endpoint de login.",
      },
    },

    schemas: {
      Role: {
        type: "string",
        enum: ["ADMIN", "USER"],
        description: "Nível de permissão do usuário",
        example: "ADMIN",
      },

      User: {
        type: "object",
        description: "Usuário",
        properties: {
          id: {
            type: "string",
            description: "Identificador único (ObjectID)",
          },
          name: {
            type: "string",
            description: "Nome completo do usuário",
            example: "Lucas Lima",
          },
          email: {
            type: "string",
            format: "email",
            description: "E-mail do usuário",
            example: "exemplo@gmail.com",
          },
          role: { $ref: "#/components/schemas/Role" },
          companyId: {
            type: "string",
            description: "Identificador da empresa do usuário",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação do usuário",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data da última atualização do usuário",
          },
          deletedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            description: "Data de exclusão lógica. Nulo quando o usuário está ativo",
          },
        },
        required: ["id", "name", "email", "role", "companyId", "createdAt", "updatedAt"],
      },

      Company: {
        type: "object",
        description: "Empresa cadastrada na plataforma.",
        properties: {
          id: {
            type: "string",
            description: "Identificador único (ObjectId do MongoDB).",
            example: "507f1f77bcf86cd799439012",
          },
          name: {
            type: "string",
            description: "Razão social da empresa.",
            example: "Acme Soluções Ltda",
          },
          cnpj: {
            type: "string",
            nullable: true,
            description: "CNPJ da empresa.",
            example: "12.345.678/0001-90",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação do registro.",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data da última atualização do registro.",
          },
        },
        required: ["id", "name", "createdAt", "updatedAt"],
      },

      Settings: {
        type: "object",
        properties: {
          theme: { type: "string", enum: ["LIGHT", "DARK", "SYSTEM"] },
          language: { type: "string", example: "pt-BR" },
          currency: { type: "string", example: "BRL" },
          notifications: { type: "boolean", example: true },
        },
        required: ["theme", "language", "currency", "notifications"],
      },

      SettingsResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          settings: { $ref: "#/components/schemas/Settings" },
          company: { $ref: "#/components/schemas/Company" },
        },
        required: ["user", "settings", "company"],
      },

      UpdateSettings: {
        type: "object",
        properties: {
          settings: { $ref: "#/components/schemas/Settings" },
          company: {
            type: "object",
            properties: {
              name: { type: "string", example: "Acme Soluções Ltda" },
              cnpj: { type: "string", nullable: true, example: "12345678000190" },
            },
          },
        },
        minProperties: 1,
      },

      UpdateUserSettings: {
        type: "object",
        properties: {
          theme: { type: "string", enum: ["LIGHT", "DARK", "SYSTEM"] },
          language: { type: "string", example: "pt-BR" },
          currency: { type: "string", example: "BRL" },
          notifications: { type: "boolean", example: true },
        },
        minProperties: 1,
      },

      UpdateOrganizationSettings: {
        type: "object",
        properties: {
          name: { type: "string", example: "Acme Soluções Ltda" },
          cnpj: { type: "string", nullable: true, example: "12345678000190" },
        },
        minProperties: 1,
      },
    },
  },

  paths: {
    "/api/settings": {
      get: {
        tags: ["Settings"],
        summary: "Consulta a configuração do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Configuração atual",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/SettingsResponse" } },
            },
          },
          401: { description: "Não autenticado" },
        },
      },
      patch: {
        tags: ["Settings"],
        summary: "Atualiza preferências ou dados da empresa",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UpdateSettings" } },
          },
        },
        responses: {
          200: {
            description: "Configuração atualizada",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/SettingsResponse" } },
            },
          },
          400: { description: "Dados inválidos" },
          401: { description: "Não autenticado" },
          403: { description: "Somente administradores podem alterar a empresa" },
        },
      },
    },
    "/api/settings/user": {
      get: {
        tags: ["Settings"],
        summary: "Consulta as configurações do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Preferências e tema atuais",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Settings" } } },
          },
          401: { description: "Não autenticado" },
        },
      },
      patch: {
        tags: ["Settings"],
        summary: "Atualiza as configurações do usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UpdateUserSettings" } },
          },
        },
        responses: {
          200: {
            description: "Configurações atualizadas",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Settings" } } },
          },
          400: { description: "Dados inválidos" },
          401: { description: "Não autenticado" },
        },
      },
    },
    "/api/settings/organization": {
      get: {
        tags: ["Settings"],
        summary: "Consulta os dados da organização",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dados atuais da organização",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Company" } } },
          },
          401: { description: "Não autenticado" },
        },
      },
      patch: {
        tags: ["Settings"],
        summary: "Atualiza os dados da organização",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrganizationSettings" },
            },
          },
        },
        responses: {
          200: {
            description: "Dados atualizados",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Company" } } },
          },
          400: { description: "Dados inválidos" },
          401: { description: "Não autenticado" },
          403: { description: "Somente administradores podem alterar a organização" },
        },
      },
    },
  },
};
