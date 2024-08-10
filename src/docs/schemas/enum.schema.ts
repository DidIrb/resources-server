export const EnumSchema = {
    type: 'object',
    properties: {
      value: {
        type: 'string',
        description: 'Value of the enum',
      },
    },
    required: ['value'],
  };
  