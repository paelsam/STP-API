import { DataTypes } from "sequelize";

import { database } from "../database/database.js";


export const Empleado = database.define('Empleados', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [10, 13],
                msg: "El número de teléfono debe tener mínimo 10 números"
            }
        }
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