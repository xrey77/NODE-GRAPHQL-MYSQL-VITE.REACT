import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User.js";
import { Product } from "./entity/Product.js";
import { Sales } from "./entity/Sales.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "rey",
    database: "node_graphql",
    synchronize: true, // Auto-creates tables (disable in production)
    logging: true,
    entities: [User, Product, Sales],
});
