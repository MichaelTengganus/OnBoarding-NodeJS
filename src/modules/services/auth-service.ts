import { UserFactory } from '../../plugins/db/models/users';

const validatePassword = (password) => {
    let msg = '';

    if (password == undefined || password == "") {
        msg += 'Password cannot be empty';
    }

    return msg;
}

export const login = async (server, body) => new Promise((resolve, reject) => {
    const { username, password } = body;

    const errPassword = validatePassword(password)
    if (errPassword) {
        reject(Error(errPassword));
    }

    const shirtDb = UserFactory(server.db);
    shirtDb.findAll({ where: { username: username, password: password } })
        .then((data) => {
            if (data.length==0) {
                reject(Error('Username or password is incorrect!'));
            } else {
                server.jwt.sign({ username: username }, (error, encoded) => {
                    if (error) {
                        reject(Error('Authentication failed!'));
                    } else {
                        resolve(encoded);
                    }
                })
            }
        }).catch((err) => {
            reject(Error());
        });
});