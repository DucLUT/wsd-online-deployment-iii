import { postgres } from "../deps.js";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
const CONCURRENT_CONNECTIONS = 2;
let pool;

if (Deno.env.get("DATABASE_URL")) {
  pool = new Pool(Deno.env.get("DATABASE_URL"), CONCURRENT_CONNECTIONS);
} else {
  pool = new Pool({
    // hostname: "snuffleupagus.db.elephantsql.com",
    // database: "ruqeaysp",
    // user: "ruqeaysp",
    // password: "DWkdDBKfjbMRPZF5gPpILm1c37FHArEB",
    // port: 5432,
  }, CONCURRENT_CONNECTIONS);
}

const executeQuery = async (query, params) => {
  const response = {};
  let client;

  try {
    client = await pool.connect();
    const result = await client.queryObject(query, params);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  return response;
};


export { pool,executeQuery };