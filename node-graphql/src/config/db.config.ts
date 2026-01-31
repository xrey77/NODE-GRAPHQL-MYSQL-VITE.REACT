export default {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "rey",
    DB: process.env.DB_NAME || "node_graphql",
    PORT: parseInt(process.env.DB_PORT || "3306", 10),
  };
  