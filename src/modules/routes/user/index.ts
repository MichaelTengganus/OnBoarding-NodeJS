import fp from 'fastify-plugin';

import { UserTO, GetUserTO, UpdateUserTO, DeleteUserTO, LoginTO, VerifyTokenTO } from './schema';

import { UserService } from '../../services/user-service'
import { AuthService } from '../../services/auth-service'

import { sendApmError } from '../../../util/apmCaptureErr'

export default fp((server, opts, next) => {

    server.post("/auth/login", { schema: LoginTO }, async (request, reply) => {
        try {
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            await authService.login(request.body)
                .then(token => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Authentication successful!',
                        token
                    });
                })
                .catch(error => {
                    console.log(error)
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error });
                })
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            throw error;
        }
    });

    server.post("/auth/verify", { schema: VerifyTokenTO }, async (request, reply) => {
        try {
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            const token = request.headers.authorization;

            await authService.verify(token)
                .then(data => {
                    return reply.code(200).send({
                        payload: data
                    });
                })
                .catch(error => {
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error });
                })
        } catch (error) {
            sendApmError(server, request, error);

            return reply.code(400).send({
                success: false,
                message: error.message,
                error
            });
        }
    });

    server.get("/user/model/getAll", { schema: GetUserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            await userService.getAllUser()
                .then(data => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Successful!',
                        data
                    })
                })
                .catch(error => {
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error })
                })
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/user/model/insert", { schema: UserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            await userService.insertUser(request.body)
                .then((data) => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Insert successful!',
                        data
                    });
                })
                .catch(error => {
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error })
                })
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.put("/user/model/update", { schema: UpdateUserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            const token = request.headers.authorization;

            await authService.verify(token)
                .then(async (data) => {
                    await userService.updateUser(request.body)
                        .then((data) => {
                            return reply.code(200).send({
                                success: true,
                                message: "Update successful",
                                data
                            });
                        })
                        .catch(error => {
                            sendApmError(server, request, error);

                            return reply.code(400).send({ success: false, message: error.message, error })
                        })
                })
                .catch(error => {
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error })
                })
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.delete("/user/model/delete", { schema: DeleteUserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            const token = request.headers.authorization;

            await authService.verify(token)
                .then(async (data) => {
                    await userService.deleteUser(request.body)
                        .then((data) => {
                            return reply.code(200).send({
                                success: true,
                                message: "Deletee successful",
                                data
                            });
                        })
                        .catch(error => {
                            sendApmError(server, request, error);

                            return reply.code(400).send({ success: false, message: error.message, error })
                        })
                })
                .catch(error => {
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error })
                })
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.send(400);
        }
    });

    next();
});