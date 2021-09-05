import fp from 'fastify-plugin';

import { UserTO, GetUserTO, UpdateUserTO, DeleteUserTO, LoginTO, VerifyTokenTO } from './schema';

import { insert, update, destroy, getAll } from '../../services/user-service'
import { login, verify } from '../../services/auth-service'

import { sendApmError } from '../../../util/apmCaptureErr'

export default fp((server, opts, next) => {

    server.post("/auth/login", { schema: LoginTO }, async (request, reply) => {
        try {
            await login(server, request.body)
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
            await verify(server, request.body)
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
            await getAll(server)
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
            await insert(server, request.body)
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
            //versi await in await work
            await verify(server, request.body)
                .then(async (data) => {
                    await update(server, request.body)
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

            //versi await - await
            //udah di return pas error verify tapi kok masih lanjut
            //padahal flow serial
            /*
            await verify(server, request.body)
                .then((data) => { })
                .catch(error => {
                    sendApmError(server, request, error);

                    return reply.code(400).send({ success: false, message: error.message, error })
                })
            await update(server, request.body)
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
            */
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.send(400);
        }
    });

    server.delete("/user/model/delete", { schema: DeleteUserTO }, async (request, reply) => {
        try {
            await verify(server, request.body)
                .then(async (data) => {
                    await destroy(server, request.body)
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