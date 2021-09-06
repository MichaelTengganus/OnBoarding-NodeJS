import { UserFactory } from '../../plugins/db/models/users';

export class UserService {

    db: any;
    redis: any;
    userModel;

    constructor(db, redis) {
        this.db = db;
        this.redis = redis;
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

    validateUpdate = (username, oldPassword, newPassword) => {
        let msg = this.validateUsernamePassword(username, oldPassword);

        if (newPassword == undefined || newPassword == "") {
            msg += 'New Password cannot be empty. ';
        }

        return msg;
    }

    insertUser = async (param) => new Promise((resolve, reject) => {
        try {
            const { username, password } = param;
            const errMessage = this.validateUsernamePassword(username, password)
            if (errMessage) {
                reject(Error(errMessage));
            }

            this.userModel.create({ username, password })
                .then(data => {
                    resolve({ Id: data.Id, username: data.username })
                }).catch(err => {
                    reject(Error("Error in insert new record"))
                });

        } catch (error) {
            resolve(error)
        }
    });

    getAllUser = async () => new Promise((resolve, reject) => {
        try {
            this.userModel.findAll()
                .then((data) => {
                    resolve(data)
                }).catch((error) => {
                    resolve(Error("Error in get record"))
                });
        } catch (error) {
            resolve(error)
        }
    });

    updateUser = async (param) => new Promise((resolve, reject) => {
        try {
            const { username, oldPassword, newPassword } = param;
            const errMessage = this.validateUpdate(username, oldPassword, newPassword)
            if (errMessage) {
                reject(Error(errMessage));
            }

            this.userModel.update({ username: username, password: newPassword }, {
                where: { username: username, password: oldPassword }
            }).then(data => {
                if (data[0] == 0) {
                    reject(Error("Username or Password is incorrect!"))
                } else {
                    this.redis.del(username, (err, val) => {
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

    deleteUser = async (param) => new Promise((resolve, reject) => {
        try {
            const { username, password } = param;
            const errMessage = this.validateUsernamePassword(username, password)
            if (errMessage) {
                reject(Error(errMessage));
            }

            this.userModel.destroy({
                where: { username, password }
            }).then(data => {
                if (data == 0) {
                    reject(Error("Username or password is incorect"))
                } else {
                    this.redis.del(username, (err, val) => {
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
}