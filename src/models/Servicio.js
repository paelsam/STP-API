import { DataTypes } from "sequelize";

import { database } from "../database/database.js";


export const Servicio = database.define('Servicios', {
    id_servicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [2, 100],
                msg: "El nombre mínimamente debe tener 2 carácteres"
            }
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tiempo_servicio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})