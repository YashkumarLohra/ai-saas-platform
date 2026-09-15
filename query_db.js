require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DIRECT_URL });
client.connect()
  .then(() => client.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'Tool\''))
  .then(res => {
     console.log(JSON.stringify(res.rows, null, 2));
     return client.query('SELECT slug, "pricingTier", "pricing", "apiAccess", "integration", "capabilities", "limitations", "inputTypes", "outputTypes" FROM "Tool"');
  })
  .then(res => {
     console.log("\n=== TOOLS ===");
     console.log(JSON.stringify(res.rows, null, 2));
  })
  .catch(e => console.error(e))
  .finally(() => client.end());
