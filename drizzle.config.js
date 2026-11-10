import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/electron/db/schema.js',
    out: './src/electron/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './kepler.dev.db',
    },
});