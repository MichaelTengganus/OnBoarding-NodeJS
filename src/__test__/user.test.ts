import * as instance from '../server';
import SequelizeMock from 'sequelize-mock';
import { UserService } from '../modules/services/userService';
import { AuthService } from '../modules/services/authService';
import fastifyJwt from "fastify-jwt";

const redisMock = require('fastify-redis-mock')

const dataInsertSuccess = {
    username: "jestUsername",
    password: "jestPassword",
};
const dataInsertFailed = {
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3RVc2VybmFtZSIsImlhdCI6MTYzMDkwMzc5OH0.ItNCbz3z2nPoNuMolINIp-I4B44Ze_bLhpRBqijiPNo";

jest.setTimeout(12000);

let server: any;

beforeAll(async () => {
    server = await instance.createServer();
});


const dbMock = new SequelizeMock();

describe('/userModel', () => {
    const userService = new UserService(dbMock, redisMock)
    // const authService = new AuthService(dbMock, redisMock, server.jwt, process.env.EXPIRE_TOKEN)

    // Spying on the actual methods of the class
    jest.spyOn(userService, 'getAllUser');
    jest.spyOn(userService, 'insertUser');
    jest.spyOn(userService, 'deleteUser');
    jest.spyOn(userService, 'validateUsernamePassword');
    // jest.spyOn(authService, 'verify');

    it('should insert user success', async () => {
        const insertUser = await userService.insertUser(dataInsertSuccess)
            .then(data => {
                expect(JSON.stringify(data)).toContain('"username":"jestUsername"')
            })
        expect(userService.validateUsernamePassword).toHaveBeenCalledTimes(1);
        expect(userService.insertUser).toHaveBeenCalledTimes(1);
    });

    it('should insert user failed', async () => {
        const insertUser = await userService.insertUser(dataInsertFailed)
            .catch(error => {
                expect(error).toEqual(Error("Username cannot be empty. Password cannot be empty. "))
            })
        expect(userService.validateUsernamePassword).toHaveBeenCalledTimes(2);
        expect(userService.insertUser).toHaveBeenCalledTimes(2);
    });

    it('should get user', async () => {
        const getAllUser = await userService.getAllUser()
        // .then(data => {
        //     expect(JSON.stringify(data)).toContain('"username":"jestUsername"')
        // });
        expect(getAllUser).toBeTruthy()
        expect(userService.getAllUser).toBeCalledTimes(1)
    });

    // expect error kara gak bisa mock data user awal
    it('should delete user', async () => {
        const deleteUser = await userService.deleteUser(dataInsertSuccess)
            .catch(error => {
                expect(error).toEqual(Error("Error in delete record"))
            })
        expect(userService.validateUsernamePassword).toHaveBeenCalledTimes(3);
        expect(userService.deleteUser).toBeCalledTimes(1)
    });

    // it('should verify user', async () => {
    //     await authService.verify(token)
    //         // .then(data => {
    //         //     expect(JSON.stringify(data)).toContain('"username":"jestUsername"')
    //         // });
    //     expect(authService.verify).toBeCalledTimes(1)
    //     expect(authService.validateToken).toBeCalledTimes(1)
    // });
});