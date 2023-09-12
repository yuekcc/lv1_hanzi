import sqlite3 from 'node-sqlite3-wasm';
import HanziDb from '../../db.js';

const { Database } = sqlite3;

const db = new Database('../../hanzi.db');
const result = db.all(`select sqlite_version() as version`);
console.log(result);

function addHanziTable() {
  HanziDb.forEach(it => {
    db.run(`insert into hanzi (hanzi, pos, pinyins, explanations) values (:hanzi, :pos, :pinyins, :explanations)`, {
      ':hanzi': it.hanzi || '',
      ':pos': it.index || 0,
      ':pinyins': JSON.stringify(it.pinyin || []),
      ':explanations': JSON.stringify(it.explanations || []),
    });
  });
}

function addPinyinToHanziPos() {
  const pinyinToPosList = {};

  HanziDb.forEach(it => {
    const pos = it.index;
    if (!it.pinyin) {
      console.log('#no pinyin', it);
      return;
    }
    it.pinyin.forEach(pinyin => {
      pinyinToPosList[pinyin] = pinyinToPosList[pinyin] || [];
      pinyinToPosList[pinyin].push(pos);
    });
  });

  Object.entries(pinyinToPosList).forEach(([pinyin, posList]) => {
    db.run(`insert into pinyin_to_hanzi_pos (pinyin, pos_list) values (:pinyin, :pos_list)`, {
      ':pinyin': pinyin,
      ':pos_list': JSON.stringify(posList),
    });
  });
}

db.close;
