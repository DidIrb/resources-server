export const UserSchema = {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'User ID',
      },
      username: {
        type: 'string',
        description: 'Username of the user',
      },
      email: {
        type: 'string',
        description: 'Email of the user',
      },
      role: {
        type: 'string',
        description: 'Role of the user',
      },
      password: {
        type: 'string',
        description: 'Password of the user',
      }
    },
    required: ['username', 'email', 'password'],
  };
  