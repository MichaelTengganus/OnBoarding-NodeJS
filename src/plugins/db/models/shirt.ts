
import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";


export interface ShirtAttributes {
    ShirtId?: string;
    ProductCode: string;
    Name: string;
    Rating: string;
    Price: string;
    Description: string;
}

export interface ShirtModel extends Model<ShirtAttributes>, ShirtAttributes { }
export class Shirt extends Model<ShirtModel, ShirtAttributes> { }

export type ShirtStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): ShirtModel;
};

const Shirts = {
    ShirtId: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    ProductCode: { type: DataTypes.STRING, allowNull: true },
    Name: { type: DataTypes.STRING, allowNull: true },
    Rating: { type: DataTypes.INTEGER, allowNull: false },
    Price: { type: DataTypes.FLOAT, allowNull: false },
    Description: { type: DataTypes.STRING, allowNull: true },
};


export const ShirtFactory = (sequalize: Sequelize): ShirtStatic => {
    const attributes = Shirts;
    return <ShirtStatic>sequalize.define("Shirt", attributes, {
        timestamps: true,
        createdAt: false,
        updatedAt: false,
    });
};

