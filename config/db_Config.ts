import {MongoClient} from "https://deno.land/x/mongo@v0.31.0/mod.ts";
import config from './env_Config.ts'

console.log('this is mongoURL: ',config.MONGO_URL)
const client = new MongoClient();

// Connecting to a Local Database
await client.connect(config.MONGO_URL);

const db = client.database("TransactionsManager");

export const CompanyCollection = db.collection("Company");

export default db