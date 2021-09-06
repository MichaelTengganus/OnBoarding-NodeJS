export const UserTO = {
    description: 'UserDetail',
    tags: ['User'],
    summary: 'User',
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
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
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }
};

export const UpdateUserTO = {
    description: 'UserDetail',
    tags: ['User'],
    summary: 'User',
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            oldPassword: { type: 'string' },
            newPassword: { type: 'string' },
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
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }
};

export const DeleteUserTO = {
    description: 'UserDetail',
    tags: ['User'],
    summary: 'User',
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
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
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }
};

export const GetUserTO = {
    description: 'UserDetail',
    tags: ['User'],
    summary: 'User',
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                success: { type: 'string' },
                message: { type: 'string' },
                data: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                }
            }
        }
    }
};

export const LoginTO = {
    description: 'Login',
    tags: ['auth'],
    summary: 'Login using username and password',
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        }
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                token: { type: 'string' },
            }
        }
    }
}

export const VerifyTokenTO = {
    description: 'verifyToken',
    tags: ['auth'],
    summary: 'Verify Token',
    // body: {
    //     type: 'object',
    //     properties: {}
    // },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                payload: { type: 'string' },
            }
        }
    }
};