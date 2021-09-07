import fp from 'fastify-plugin';

import { UserTO, GetUserTO, UpdateUserTO, DeleteUserTO, LoginTO, VerifyTokenTO } from './schema';

import { UserService } from '../../services/user-service'
import { AuthService } from '../../services/auth-service'

import { sendApmError } from '../../../util/apmCaptureErr'

export default fp((server, opts, next) => {

    server.post("/auth/login", { schema: LoginTO }, async (request, reply) => {
        try {
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            const token = await authService.login(request.body)
            return reply.code(200).send({
                success: true,
                message: 'Authentication successful!',
                token
            });
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

            const data = await authService.verify(token)
            return reply.code(200).send({
                payload: data
            });
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
            const data = await userService.getAllUser()
            return reply.code(200).send({
                success: true,
                message: 'Successful!',
                data
            })
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.code(400).send({ success: false, message: error.message, error })
        }
    });

    server.post("/user/model/insert", { schema: UserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            const data = await userService.insertUser(request.body)
            return reply.code(200).send({
                success: true,
                message: 'Insert successful!',
                data
            });
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.code(400).send({ success: false, message: error.message, error })
        }
    });

    server.put("/user/model/update", { schema: UpdateUserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            const token = request.headers.authorization;

            await authService.verify(token)
            const data = await userService.updateUser(request.body)

            return reply.code(200).send({
                success: true,
                message: "Update successful",
                data
            });
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.code(400).send({ success: false, message: error.message, error })
        }
    });

    server.delete("/user/model/delete", { schema: DeleteUserTO }, async (request, reply) => {
        try {
            const userService = new UserService(server.db, server.redis);
            const authService = new AuthService(server.db, server.redis, server.jwt, server.conf);
            const token = request.headers.authorization;

            await authService.verify(token)
            const data = await userService.deleteUser(request.body)

            return reply.code(200).send({
                success: true,
                message: "Delete successful",
                data
            });
        } catch (error) {
            sendApmError(server, request, error);

            request.log.error(error);
            return reply.code(400).send({ success: false, message: error.message, error })
        }
    });

    next();
});