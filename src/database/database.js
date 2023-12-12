import { Sequelize } from "sequelize";
import 'dotenv/config'

const { DB_CONNECTION } = process.env;

export const database = new Sequelize(DB_CONNECTION || "");

