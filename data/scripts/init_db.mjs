import sqlite3 from 'node-sqlite3-wasm';

const DB_FILE = '../../hanzi.sqlite3';
const db = new sqlite3.Database(DB_FILE);
const result = db.all(`select sqlite_version() as version`);
console.log(result);

const hanziSql = `CREATE TABLE hanzi (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	hanzi TEXT NOT NULL,
	pos INTEGER NOT NULL,
	pinyins TEXT NOT NULL DEFAULT '',
	level TEXT NOT NULL DEFAULT '',
	explanations TEXT NOT NULL DEFAULT '')`;

const pinyinToHanziPosSql = `CREATE TABLE pinyin_to_hanzi_pos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "pinyin" TEXT NOT NULL,
    "pos" integer)`;

const hanziIndex = `CREATE INDEX index_hanzi ON hanzi(hanzi)`;
const posIndex = `CREATE INDEX index_pos ON hanzi(pos)`;
const pinyinToHanziPosIndex = `CREATE INDEX index_pinyin_to_hanzi ON pinyin_to_hanzi_pos(pinyin)`;

const sqls = [hanziSql, pinyinToHanziPosSql, hanziIndex, posIndex, pinyinToHanziPosIndex];
sqls.forEach(sql => db.exec(sql));
