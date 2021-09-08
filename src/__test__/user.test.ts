import * as instance from '../server';
import SequelizeMock from 'sequelize-mock';
import { UserService } from '../modules/services/userService';
import { AuthService } from '../modules/services/authService';
import fastifyJwt, { fastifyJWT } from "fastify-jwt";

const redisMock = require('fastify-redis-mock')

const mockUser = {
    username: "jestUsername",
    password: "jestPassword"
};

const mockUpdate = {
    username: "jestUsername",
    oldPassword: "jestOldPassword",
    newPassword: "jestNewPassword",
};

let result: any;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3RVc2VybmFtZSIsImlhdCI6MTYzMDkwMzc5OH0.ItNCbz3z2nPoNuMolINIp-I4B44Ze_bLhpRBqijiPNo";


jest.setTimeout(12000);

let server: any;

beforeAll(async () => {
    server = await instance.createServer();
});


const dbMock = new SequelizeMock();

describe('userService', () => {
    const userService = new UserService(dbMock, redisMock)
    jest.spyOn(userService, 'validateUsernamePassword');
    jest.spyOn(userService, 'validateUpdate');

    it('test validateUsernamePassword', async () => {
        result = await userService.validateUsernamePassword(mockUser.username, mockUser.password);
        expect(result).toEqual("");
    });

    it('test validateUpdate', async () => {
        result = await userService.validateUpdate(mockUpdate.username, mockUpdate.oldPassword, mockUpdate.newPassword);
        expect(result).toEqual("");
    });

    it('|- all message', async () => {
        result = await userService.validateUpdate(null, null, null);
        expect(result).toEqual("Username cannot be empty. Password cannot be empty. New Password cannot be empty. ");
    });
});


describe('AuthService', () => {
    const authService = new AuthService(dbMock, redisMock, fastifyJWT, 3600);
    jest.spyOn(authService, 'validateUsernamePassword');
    jest.spyOn(authService, 'validateToken');
    jest.spyOn(authService, 'findUser');

    it('test validateUsernamePassword', async () => {
        result = await authService.validateUsernamePassword(mockUser.username, mockUser.password);
        expect(result).toEqual("");
    });

    it('|- all message', async () => {
        result = await authService.validateUsernamePassword(null, null);
        expect(result).toEqual("Username cannot be empty. Password cannot be empty. ");
    });

    it('test validateToken', async () => {
        result = await authService.validateToken(token);
        expect(result).toEqual("");
    });

    it('|- all message', async () => {
        result = await authService.validateToken(null);
        expect(result).toEqual("Token cannot be empty. ");
    });

    it('test findUser', async () => {
        result = await authService.findUser(mockUser.username, mockUser.password);
        const { dataValues } = result
        expect(dataValues).toMatchObject(mockUser);
    });

});