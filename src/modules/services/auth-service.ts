import { UserFactory } from '../../plugins/db/models/users';

const validateUsernamePassword = (usernamee, password) => {
    let msg = '';
    if (usernamee == undefined || usernamee == "") {
        msg += 'Usernamee cannot be empty. ';
    }

    if (password == undefined || password == "") {
        msg += 'Password cannot be empty. ';
    }

    return msg;
}

export const login = async (server, body) => new Promise((resolve, reject) => {
    try {
        const { username, password } = body;
        const errMessage = validateUsernamePassword(username, password)

        if (errMessage) {
            reject(Error(errMessage));
        }

        const shirtDb = UserFactory(server.db);
        shirtDb.findAll({ where: { username: username, password: password } })
            .then((data) => {
                if (data.length == 0) {
                    reject(Error('Username or password is incorrect!'));
                } else {
                    server.jwt.sign({ username: username }, (error, token) => {
                        if (error) {
                            reject(Error('Authentication failed!'));
                        } else {
                            server.redis.set(username, JSON.stringify({ username, token }), "EX", server.conf.expireToken, (err, val) => {
                                if (err) {
                                    reject(Error('Authentication failed! Failed to set redis.'));
                                } else {
                                    resolve(token);
                                }
                            })
                        }
                    })
                }
            }).catch((err) => {
                reject(Error());
            });
    } catch (error) {
        reject(error);
    }
});

export const verify = async (server, body) => new Promise((resolve, reject) => {
    try {
        const { token } = body;
        if (token) {
            server.jwt.verify(token, (error, decoded) => {
                if (error) {
                    reject(error)
                } else {
                    server.redis.get(decoded.username, (err, val) => {
                        if (val == null) {
                            reject(Error("Token not valid."));
                        } else {
                            resolve("Authentication successful! Token is valid.");
                        }
                    })
                }
            });
        } else {
            reject(Error('Verify failed! Please check the request'));
        }
    } catch (error) {
        reject(error);
    }
})
