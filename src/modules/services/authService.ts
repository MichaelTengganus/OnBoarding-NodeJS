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
            msg += 'Token cannot be empty. ';
        }

        return msg;
    }

    findUser = (username, password) => new Promise((resolve, reject) => {
        this.userModel.findOne({ where: { username, password } })
            .then((data) => {
                if (data == null) {
                    reject(Error('Username or password is incorrect!'))
                } else {
                    resolve(data)
                }
            }).catch((error) => {
                reject(error)
            });
    })

    redisSet = (key, data) => new Promise((resolve, reject) => {
        this.redis.set(key, data, "EX", this.conf.expireToken, (err, val) => {
            if (err) {
                reject(Error('Authentication failed! Failed to set redis.'))
            } else {
                resolve("Authentication success!")
            }
        })
    })

    redisVerifyGet = (key) => new Promise((resolve, reject) => {
        this.redis.get(key, (err, val) => {
            if (val == null) {
                reject(Error('Authentication failed! Token invalid.'))
            } else if (err != null) {
                reject(err)
            }
            else {
                resolve("Authentication successful! Token is valid.");
            }
        })
    })

    login = (param) => new Promise(async (resolve, reject) => {
        try {
            const { username, password } = param;
            const errMessage = this.validateUsernamePassword(username, password)
            if (errMessage) {
                reject(Error(errMessage));
            }

            await this.findUser(username, password)

            const token = this.jwt.sign({ username })

            await this.redisSet(username, JSON.stringify({ username, token }))
            resolve(token);
        } catch (error) {
            reject(error);
        }
    })

    verify = async (param) => new Promise(async (resolve, reject) => {
        try {
            const token = param;
            const errMessage = this.validateToken(token)

            if (errMessage) {
                reject(Error(errMessage));
            }

            const decoded = this.jwt.verify(token)
            const redisVerify = await this.redisVerifyGet(decoded.username)
            resolve(redisVerify);
        } catch (error) {
            reject(error);
        }
    })

}
