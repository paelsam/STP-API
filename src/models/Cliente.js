import { DataTypes } from "sequelize";

import { database } from "../database/database.js";


export const Cliente = database.define('Clientes', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [2, 255],
                msg: "El nombre mínimamente debe tener 2 carácteres"
            }
        }
    },
    numero_documento: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "El correo no es válido"
            }
        }
    }
})