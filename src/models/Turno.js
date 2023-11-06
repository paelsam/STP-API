import { DataTypes } from "sequelize";

import { database } from "../database/database.js";
import { Empleado } from "./Empleado.js";
import { Cliente } from "./Cliente.js";
import { Servicio } from "./Servicio.js";


export const Turno = database.define('Turno', {
    id_turno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_turno: {
        type: DataTypes.STRING(5),
        allowNull: true,
        unique: true,
    }, 
    estado: {
        type: DataTypes.ENUM("COMPLETADO", "EN CURSO", "EN ESPERA"),
        defaultValue: "EN ESPERA"
    }  
});

Turno.belongsTo(Empleado, { foreignKey: 'id_empleado' });
Turno.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Turno.belongsTo(Servicio, { foreignKey: 'id_servicio' });

Turno.beforeCreate(async (turno, options) => {
    const count = await Turno.count();
    turno.numero_turno = 'A' + (count + 1).toString().padStart(2, '0');
});