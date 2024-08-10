import { Options } from 'swagger-jsdoc';
import { AuthSchema } from '../docs/schemas/auth.schema';
import { ResourceSchema } from '../docs/schemas/resource.schema';
import { UserSchema } from '../docs/schemas/user.schema';
import { EnumSchema } from '../docs/schemas/enum.schema';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Resources API',
      version: '1.0.0',
      description: 'API for listing useful resources like educational materials, apps, and tools.',
    },
    components: {
      schemas: {
        Auth: AuthSchema,
        Resource: ResourceSchema,
        User: UserSchema,
        Enum: EnumSchema,
      },
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/docs/swagger/*.ts'], // Include the new Swagger definition file
};

export default options;
