export const GetShirtTO = {
    description: 'ShirtDetail',
    tags: ['Shirt'],
    summary: 'Shirt',
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    ShirtId: { type: 'string', format: 'uuid' },
                    ProductCode: { type: 'string' },
                    Name: { type: 'string' },
                    Rating: { type: 'integer' },
                    Price: { type: 'number' },
                    Description: { type: 'string' },
                }
            }
        }
    }
};


export const ShirtTO = {
    description: 'ShirtDetail',
    tags: ['Shirt'],
    summary: 'Shirt',
    body: {
        type: 'object',
        properties: {
            ShirtId: { type: 'string', format: 'uuid' },
            ProductCode: { type: 'string' },
            Name: { type: 'string' },
            Rating: { type: 'integer' },
            Price: { type: 'number' },
            Description: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    ShirtId: { type: 'string', format: 'uuid' },
                    ProductCode: { type: 'string' },
                    Name: { type: 'string' },
                    Rating: { type: 'integer' },
                    Price: { type: 'number' },
                    Description: { type: 'string' },
                }
            }
        }
    }
};

export const ShirtIdTO = {
    description: 'ShirtDetail',
    tags: ['Shirt'],
    summary: 'Shirt',
    body: {
        type: 'object',
        properties: {
            ShirtId: { type: 'string', format: 'uuid' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    ShirtId: { type: 'string', format: 'uuid' },
                    ProductCode: { type: 'string' },
                    Name: { type: 'string' },
                    Rating: { type: 'integer' },
                    Price: { type: 'number' },
                    Description: { type: 'string' },
                }
            }
        }
    }
};

// test Swagger path param
export const ShirtParam = {
    path: "/shirt/model/{ShirtId}",
    description: 'ShirtDetail',
    tags: ['Shirt'],
    summary: 'Shirt',
    params: {
        in: 'path',
        type: 'object',
        properties: {
            ShirtId: {
                type: 'string',
                format: 'uuid',
                description: 'ShirtId'
            }
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    ShirtId: { type: 'string', format: 'uuid' },
                    ProductCode: { type: 'string' },
                    Name: { type: 'string' },
                    Rating: { type: 'integer' },
                    Price: { type: 'number' },
                    Description: { type: 'string' },
                }
            }
        }
    }
};