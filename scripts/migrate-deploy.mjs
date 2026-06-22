import "dotenv/config";
import { spawnSync } from "node:child_process";

function getMigrationDatabaseUrl() {
  const directUrl = process.env.DIRECT_URL?.trim();
  if (directUrl) {
    return directUrl;
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return databaseUrl.includes("-pooler.")
    ? databaseUrl.replace("-pooler.", ".")
    : databaseUrl;
}

function withConnectTimeout(connectionString) {
  const url = new URL(connectionString);
  if (!url.searchParams.has("connect_timeout")) {
    url.searchParams.set("connect_timeout", "30");
  }
  return url.toString();
}

async function releaseStalePrismaMigrationLock(connectionString) {
  const { Client } = await import("pg");
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const { rows } = await client.query(`
      SELECT PSA.pid
      FROM pg_locks AS PL
      INNER JOIN pg_stat_activity AS PSA ON PSA.pid = PL.pid
      WHERE PL.locktype = 'advisory'
        AND PL.objid = 72707369
        AND PSA.pid <> pg_backend_pid()
    `);

    for (const row of rows) {
      await client.query("SELECT pg_terminate_backend($1)", [row.pid]);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  const connectionString = withConnectTimeout(getMigrationDatabaseUrl());

  console.log("Releasing stale Prisma migration locks, if any...");
  await releaseStalePrismaMigrationLock(connectionString);

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    console.log(`Running prisma migrate deploy (attempt ${attempt}/${maxAttempts})...`);

    const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: true,
      env: process.env,
    });

    if (result.status === 0) {
      return;
    }

    if (attempt < maxAttempts) {
      await releaseStalePrismaMigrationLock(connectionString);
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }

  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
