export const ResourceSchema = {
    type: 'object',
    properties: {
      icon: {
        type: 'string',
        description: 'Icon representing the resource',
      },
      title: {
        type: 'string',
        description: 'Title of the resource',
      },
      description: {
        type: 'string',
        description: 'Description of the resource',
      },
      type: {
        type: 'string',
        description: 'Type of the resource',
      },
      topic: {
        type: 'string',
        description: 'Topic of the resource',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Tags associated with the resource',
      },
      link: {
        type: 'string',
        description: 'Link to the resource',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date when the resource was last updated',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Date when the resource was created',
      },
    },
    required: ['icon', 'title', 'description', 'type', 'topic', 'tags', 'link', 'updatedAt', 'createdAt'],
  };
  