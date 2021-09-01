import { SwaggerOptions } from "fastify-swagger";

const options: SwaggerOptions = {
    routePrefix: '/swagger',
    swagger: {
        info: {
            title: 'API Documentation',
            description: 'API Documentation',
            version: '0.1.0'
        },
        securityDefinitions: {
            APIKeyHeader: {
                type: 'apiKey',
                name: 'Authorization',
                description: "Value: Bearer <Token>",
                in: 'header'
            }
        },
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        security: [
            {
                APIKeyHeader: []
            },
        ]
    },
    hideUntagged: true,
    exposeRoute: true,
};

export default {
    options,
};