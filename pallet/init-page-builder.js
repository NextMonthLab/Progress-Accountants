import { migratePageBuilderTables } from './server/db-migrate-page-builder.ts';

console.log('Starting page builder tables initialization...');

migratePageBuilderTables()
  .then(() => {
    console.log('Page builder tables initialized successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to initialize page builder tables:', error);
    process.exit(1);
  });