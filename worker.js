import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

function setup(sqlite3) {
  let db;
  try {
    console.log('Running Sqlite3, version:', sqlite3.version.libVersion);

    db = new sqlite3.oo1.DB('/hanzi.db', 'ct');
    const data = db.exec(`select * from sqlite_master where type = 'table'`);
    console.log(data);
  } finally {
    db?.close();
  }
}

sqlite3InitModule().then(mod => setup(mod));
