import fp from 'fastify-plugin';

import { GetShirtTO, ShirtTO, ShirtIdTO, ShirtParam, } from './schema';
import { ShirtFactory } from '../../../plugins/db/models/shirt';


export default fp((server, opts, next) => {

    server.get("/shirt/getAll", { schema: GetShirtTO }, (request, reply) => {
        try {
            const shirtDb = ShirtFactory(server.db);
            shirtDb.findAll()
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

    server.get("/shirt/model/:ShirtId", { schema: ShirtParam }, (request, reply) => {
        try {
            const ShirtId = request.params.ShirtId
            const shirtDb = ShirtFactory(server.db);
            shirtDb.findAll({
                where: { ShirtId: ShirtId }
            }).then(data => {
                return reply.code(200).send({
                    success: true,
                    message: 'Get ' + ShirtId + ' successful!',
                    data
                });
            }).catch(err => {
                server.apm.captureError({
                    method: request.routerMethod,
                    path: request.routerPath,
                    param: request.body,
                    error: err,
                })

                return reply.code(400).send({
                    success: false,
                    message: 'Error in getting new record',
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
    server.post("/shirt/model/get", { schema: ShirtIdTO }, (request, reply) => {
        try {
            const { ShirtId } = request.body;
            const shirtDb = ShirtFactory(server.db);
            shirtDb.findAll({
                where: { ShirtId: ShirtId }
            }).then(data => {
                return reply.code(200).send({
                    success: true,
                    message: 'Get ' + ShirtId + ' successful!',
                    data
                });
            }).catch(err => {
                server.apm.captureError({
                    method: request.routerMethod,
                    path: request.routerPath,
                    param: request.body,
                    error: err,
                })

                return reply.code(400).send({
                    success: false,
                    message: 'Error in getting new record',
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

    server.post("/shirt/model/insert", { schema: ShirtTO }, (request, reply) => {
        try {
            const { ShirtId, ProductCode, Name, Rating, Price, Description } = request.body;

            const shirtDb = ShirtFactory(server.db);
            shirtDb.create({ ShirtId, ProductCode, Name, Rating, Price, Description })
                .then(data => {
                    return reply.code(200).send({
                        success: true,
                        message: 'Insert ' + ShirtId + ' successful!',
                        data: {
                            ShirtId: data.ShirtId
                            , ProductCode: data.ProductCode
                            , Name: data.Name
                            , Rating: data.Rating
                            , Price: data.Price
                            , Description: data.Description
                        }
                    });
                }).catch(err => {
                    server.apm.captureError({
                        method: request.routerMethod,
                        path: request.routerPath,
                        param: request.body,
                        error: err,
                    })

                    return reply.code(400).send({
                        success: false,
                        message: 'Error in insert new record',
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

    server.put("/shirt/model/update", { schema: ShirtTO }, (request, reply) => {
        try {
            const { ShirtId, ProductCode, Name, Rating, Price, Description } = request.body;

            const shirtDb = ShirtFactory(server.db);
            shirtDb.update({ ShirtId, ProductCode, Name, Rating, Price, Description },
                {
                    where: { ShirtId: ShirtId }
                }).then(data => {
                    if (data[0] == 0) {
                        const msg = "Data " + ShirtId + "not found";
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
                            message: 'Update ' + ShirtId + ' successful!',
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

    server.delete("/shirt/model/delete", { schema: ShirtIdTO }, (request, reply) => {
        try {
            const { ShirtId } = request.body;
            const shirtDb = ShirtFactory(server.db);
            shirtDb.destroy({
                where: { ShirtId: ShirtId }
            }).then(data => {
                return reply.code(200).send({
                    success: true,
                    message: 'Delete ' + ShirtId + ' successful!',
                    data
                });
            }).catch(err => {
                server.apm.captureError({
                    method: request.routerMethod,
                    path: request.routerPath,
                    param: request.body,
                    error: err,
                })

                return reply.code(400).send({
                    success: false,
                    message: 'Error in deleting new record',
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