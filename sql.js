import { SqliteClient } from '@sqlite.org/sqlite-wasm';

const dbFile = '/hanzi.db';
const sqlite = new SqliteClient(dbFile, '');
await sqlite.init();

const osList = await sqlite.executeSql(`select pos from hanzi`);
console.log(`osList`, osList);
