import fp from 'fastify-plugin';

import { UserTO, GetUserTO, LoginTO, VerifyTokenTO } from './schema';
import { UserFactory } from '../../../plugins/db/models/users';

import { insert } from '../../services/user-service'
import { login } from '../../services/auth-service'

export default fp((server, opts, next) => {

    server.post("/auth/login", { schema: LoginTO }, (request, reply) => {
        try {
            const { username, password } = request.body;

            if (username && password) {
                login(server, request.body)
                    .then(encoded => {
                        server.redis.set(username, JSON.stringify({ username, token: encoded }), "EX", server.conf.expireToken, (err, val) => {
                            if (err) {
                                server.apm.captureError({
                                    method: request.routerMethod,
                                    path: request.routerPath,
                                    param: request.body,
                                    error: err,
                                })

                                return reply.code(400).send({
                                    success: false,
                                    message: 'Authentication failed! Failed to set redis.'
                                });

                            } else {
                                return reply.code(200).send({
                                    success: true,
                                    message: 'Authentication successful!',
                                    token: encoded,
                                });
                            }
                        })
                    })
                    .catch(error => {
                        server.apm.captureError({
                            method: request.routerMethod,
                            path: request.routerPath,
                            param: request.body,
                            error: error
                        })

                        return reply.code(400).send({
                            success: false,
                            message: error.message,
                            error
                        });
                    })
            }
        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            })

            request.log.error(error);
            throw error;
        }
    });

    server.post("/auth/verify", { schema: VerifyTokenTO }, (request, reply) => {
        try {
            const { token } = request.body;
            if (token) {
                // verify jwt
                server.jwt.verify(token, (error, decoded) => {
                    if (error) {
                        server.apm.captureError({
                            method: request.routerMethod,
                            path: request.routerPath,
                            param: request.body,
                            error
                        })

                        return reply.code(400).send({
                            success: false,
                            message: 'Token not valid. ' + (error.name || error.message),
                            data: false
                        });
                    } else {
                        server.redis.get(decoded.username, (err, val) => {
                            if (val == null) {
                                return reply.code(400).send({
                                    success: false,
                                    message: 'Token not on redis',
                                    data: false
                                });
                            } else {
                                return reply.code(200).send({
                                    payload: 'Authentication successful! Token is valid.'
                                });
                            }
                        })
                    }
                });
            } else {
                server.apm.captureError({
                    method: request.routerMethod,
                    path: request.routerPath,
                    param: request.body,
                    error: 'Verify failed! Please check the request',
                })

                return reply.code(400).send({
                    success: false,
                    message: 'Verify failed! Please check the request'
                });
            }

        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            })

            request.log.error(error);
            throw error;
        }
    });

    server.get("/user/model/getAll", { schema: GetUserTO }, (request, reply) => {
        try {
            const userDb = UserFactory(server.db);
            userDb.findAll()
                .then((data) => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Successful!',
                        data
                    });
                }).catch((err) => {
                    server.apm.captureError({
                        method: request.routerMethod,
                        path: request.routerPath,
                        param: request.body,
                        error: err,
                    })

                    return reply.code(400).send({
                        success: false,
                        message: 'Error get data.',
                        err,
                    });
                });
        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error
            })

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/user/model/insert", { schema: UserTO }, (request, reply) => {
        try {
            const { username, password } = request.body;
            if (username && password) {
                insert(server, request.body)
                    .then((data) => {
                        return reply.code(200).send({
                            success: true,
                            message: 'Insert successful!',
                            data
                        });
                    }).catch(err => {
                        const msg = "Error in insert new record";
                        server.apm.captureError({
                            method: request.routerMethod,
                            path: request.routerPath,
                            param: request.body,
                            error: msg,
                        })
                        return reply.send(400);
                    })
            } else {
                return reply.code(400).send({
                    success: false,
                    message: 'Insert failed! Please check the request'
                });
            }

        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            })

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.put("/user/model/update", { schema: UserTO }, (request, reply) => {
        try {
            const { username, password } = request.body;

            const userDb = UserFactory(server.db);
            userDb.update({ username, password }, {
                where: { username: username }
            }).then(data => {
                if (data[0] == 0) {
                    const msg = "User " + username + "not found";
                    server.apm.captureError({
                        method: request.routerMethod,
                        path: request.routerPath,
                        param: request.body,
                        error: msg,
                    })
                    return reply.send(400);
                } else {
                    return reply.code(200).send({
                        success: true,
                        message: 'Update ' + username + ' successful!',
                        data
                    });
                }
            }).catch(err => {
                server.apm.captureError({
                    method: request.routerMethod,
                    path: request.routerPath,
                    param: request.body,
                    error: err,
                })

                return reply.code(400).send({
                    success: false,
                    message: 'Error in updating new record',
                    data: err,
                });
            });
        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error
            })

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.delete("/user/model/delete", { schema: UserTO }, (request, reply) => {
        try {
            const { username, password } = request.body;
            const userDb = UserFactory(server.db);
            userDb.destroy({
                where: { username: username, password: password }
            }).then(data => {
                if (data == 0) {
                    const msg = "Username or password is incorect";
                    server.apm.captureError({
                        method: request.routerMethod,
                        path: request.routerPath,
                        param: request.body,
                        error: msg,
                    })
                    return reply.code(400).send({
                        success: false,
                        message: msg,
                        data
                    });
                } else {
                    return reply.code(200).send({
                        success: true,
                        message: 'Delete ' + username + ' successful!',
                        data
                    });
                }
            }).catch(err => {
                server.apm.captureError({
                    method: request.routerMethod,
                    path: request.routerPath,
                    param: request.body,
                    error: err,
                })

                return reply.code(400).send({
                    success: false,
                    message: 'Error in deleting record',
                    data: err,
                });
            });
        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error
            })

            request.log.error(error);
            return reply.send(400);
        }
    });

    next();
});