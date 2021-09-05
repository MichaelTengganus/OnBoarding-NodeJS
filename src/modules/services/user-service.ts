import { UserFactory } from '../../plugins/db/models/users';

const validateUsernamePassword = (username, password) => {
    let msg = '';
    if (username == undefined || username == "") {
        msg += 'Username cannot be empty. ';
    }

    if (password == undefined || password == "") {
        msg += 'Password cannot be empty. ';
    }

    return msg;
}

const validateUpdate = (usernamee, oldPassword, newPassword) => {
    let msg = validateUsernamePassword(usernamee, oldPassword);

    if (newPassword == undefined || newPassword == "") {
        msg += 'New Password cannot be empty. ';
    }

    return msg;
}

export const insert = async (server, body) => new Promise((resolve, reject) => {
    try {
        const { username, password } = body;
        const errMessage = validateUsernamePassword(username, password)

        if (errMessage) {
            reject(Error(errMessage));
        }

        const userDb = UserFactory(server.db);

        userDb.create({ username, password })
            .then(data => {
                resolve({ Id: data.Id, username: data.username })
            }).catch(err => {
                reject(Error("Error in insert new record"))
            });

    } catch (error) {
        resolve(error)
    }
});

export const getAll = async (server) => new Promise((resolve, reject) => {
    try {
        const userDb = UserFactory(server.db);
        userDb.findAll()
            .then((data) => {
                resolve(data)
            }).catch((error) => {
                resolve(Error("Error in get record"))
            });
    } catch (error) {
        resolve(error)
    }
});

export const update = async (server, body) => new Promise((resolve, reject) => {
    try {
        const { username, oldPassword, newPassword } = body;
        const errMessage = validateUpdate(username, oldPassword, newPassword)

        if (errMessage) {
            reject(Error(errMessage));
        }

        const userDb = UserFactory(server.db);

        userDb.update({ username: username, password: newPassword }, {
            where: { username: username, password: oldPassword }
        }).then(data => {
            if (data[0] == 0) {
                reject(Error("Username or Password is incorrect!"))
            } else {
                server.redis.del(username, (err, val) => {
                    if (val == null) {
                        reject(Error("Token not valid."));
                    } else {
                        resolve({
                            username: username,
                            password: newPassword
                        })
                    }
                })
            }
        }).catch(error => {
            reject(Error("Error in update record"))
        });
    } catch (error) {
        reject(error)
    }
});

export const destroy = async (server, body) => new Promise((resolve, reject) => {
    try {
        const { username, password } = body;
        const errMessage = validateUsernamePassword(username, password)

        if (errMessage) {
            reject(Error(errMessage));
        }

        const userDb = UserFactory(server.db);
        userDb.destroy({
            where: { username, password }
        }).then(data => {
            if (data == 0) {
                reject(Error("Username or password is incorect"))
            } else {
                server.redis.del(username, (err, val) => {
                    if (val == null) {
                        reject(Error("Token not valid."));
                    } else {
                        resolve({ username, password })
                    }
                })
            }
        }).catch(error => {
            reject(Error("Error in update record"))
        });

    } catch (error) {
        resolve(error)
    }
});