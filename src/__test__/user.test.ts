import * as instance from '../server';
import SequelizeMock from 'sequelize-mock';

import { UserService } from '../modules/services/user-service';

const dataInsert = {
    username: "jestUsername",
    password: "jestPassword",
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Implc3RVc2VybmFtZSIsImlhdCI6MTYzMDkwMzc5OH0.ItNCbz3z2nPoNuMolINIp-I4B44Ze_bLhpRBqijiPNo";

jest.setTimeout(12000);

let server: any;
beforeAll(async () => {
    server = await instance.createServer();
});

