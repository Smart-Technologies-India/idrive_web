import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "xewjuqrf_chohan2",
  })
  .promise();

export default pool;
