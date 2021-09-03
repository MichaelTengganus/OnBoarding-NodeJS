import { UserFactory } from '../../plugins/db/models/users';


export const insert = async (server, body) => new Promise((resolve, reject) => {
    const { username, password } = body;

    const userDb = UserFactory(server.db);

    userDb.create({ username, password })
        .then(data => {
            resolve({ Id: data.Id, username: data.username })
        }).catch(err => {
            reject(err)
        });
});