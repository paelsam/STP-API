import { DataTypes } from "sequelize";

import { database } from "../database/database.js";


export const Administrador = database.define('Administradores', {
    id_administrador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "El correo no es válido"
            }
        }
    },
    password:  {
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: "La contraseña debe tener mínimo 6 caracteres"
            }
        }
    }
});