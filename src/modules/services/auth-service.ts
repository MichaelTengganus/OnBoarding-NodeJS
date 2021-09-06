import { UserFactory } from '../../plugins/db/models/users';

export class AuthService {

    db: any;
    redis: any;
    jwt: any;
    conf: any;
    userModel;

    constructor(db, redis, jwt, conf) {
        this.db = db;
        this.redis = redis;
        this.jwt = jwt;
        this.conf = conf;
        this.userModel = UserFactory(this.db);
    }

    validateUsernamePassword = (username, password) => {
        let msg = '';
        if (username == undefined || username == "") {
            msg += 'Username cannot be empty. ';
        }

        if (password == undefined || password == "") {
            msg += 'Password cannot be empty. ';
        }

        return msg;
    }

    validateToken = (token) => {
        let msg = '';
        if (token == undefined || token == "") {
            msg += 'token cannot be empty. ';
        }

        return msg;
    }

    login = async (param) => new Promise((resolve, reject) => {
        try {
            const { username, password } = param;
            const errMessage = this.validateUsernamePassword(username, password)

            if (errMessage) {
                reject(Error(errMessage));
            }

            this.userModel.findAll({ where: { username: username, password: password } })
                .then((data) => {
                    if (data.length == 0) {
                        reject(Error('Username or password is incorrect!'));
                    } else {
                        this.jwt.sign({ username: username }, (error, token) => {
                            if (error) {
                                reject(Error('Authentication failed!'));
                            } else {
                                this.redis.set(username, JSON.stringify({ username, token }), "EX", this.conf.expireToken, (err, val) => {
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

    verify = async (param) => new Promise((resolve, reject) => {
        try {
            const token = param;
            const errMessage = this.validateToken(token)

            if (errMessage) {
                reject(Error(errMessage));
            }

            this.jwt.verify(token, (error, decoded) => {
                if (error) {
                    reject(error)
                } else {
                    this.redis.get(decoded.username, (err, val) => {
                        if (val == null) {
                            reject(Error("Token not valid."));
                        } else {
                            resolve("Authentication successful! Token is valid.");
                        }
                    })
                }
            });
        } catch (error) {
            reject(error);
        }
    })

}
