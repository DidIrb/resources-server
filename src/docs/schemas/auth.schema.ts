export const AuthSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
    },
    required: ['username', 'password'],
    example: {
        username: 'irbaye',
        password: 'password123',
    },
};
