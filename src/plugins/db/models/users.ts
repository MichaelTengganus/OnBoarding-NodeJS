
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface UsersAttributes {
    Id?: string;
    username: string;
    password: string;
    createdDate?: Date;
}

export interface UserModel extends Model<UsersAttributes>, UsersAttributes { }
export class User extends Model<UserModel, UsersAttributes> { }

export type UserStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel;
};

const users = {
    Id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    username: { primaryKey: true, type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
};


export const UserFactory = (sequalize: Sequelize): UserStatic => {
    const attributes = users;
    return <UserStatic>sequalize.define("Users", attributes, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // If don't want createdAt
        createdAt: false,

        // If don't want updatedAt
        updatedAt: false,
    });
};

