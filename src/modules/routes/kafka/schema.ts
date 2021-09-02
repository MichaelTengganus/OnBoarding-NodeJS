export const PublishKafkaTO = {
    description: 'kafka',
    tags: ['kafka'],
    summary: 'Kafka',
    body: {
        type: 'object',
        properties: {
            topic: { type: 'string' },
            messages: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: { type: 'string' }
            }
        }
    }
}

export const TopicKafkaTO = {
    description: 'kafka',
    tags: ['kafka'],
    summary: 'Kafka',
    body: {
        type: 'object',
        properties: {
            topics: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
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
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

export const SubscribeKafkaTO = {
    description: 'kafka',
    tags: ['kafka'],
    summary: 'Kafka',
    body: {
        type: 'object',
        properties: {
            topic: { type: 'string' },
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
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            highWaterOffset: { type: 'string' },
                            key: { type: 'string' },
                            partition: { type: 'string' },
                            topic: { type: 'string' },
                            value: { type: 'string' },
                        }
                    }

                }
            }
        }
    }
}
