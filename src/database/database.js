import { Sequelize } from "sequelize";
import 'dotenv/config'

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

export const database = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres'
});

