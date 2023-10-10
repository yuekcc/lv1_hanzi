import sqlite3 from 'node-sqlite3-wasm';
// import HanziDb from '../../db.js';

const db = new sqlite3.Database('../../hanzi.sqlite3');
const result = db.all(`select sqlite_version() as version`);
console.log(result);

function addHanziTable(docs, level) {
  docs.forEach(it => {
    db.run(
      `insert into hanzi (hanzi, pos, pinyins, explanations, level) values (:hanzi, :pos, :pinyins, :explanations, :level)`,
      {
        ':hanzi': it.hanzi || '',
        ':pos': it.index || 0,
        ':pinyins': JSON.stringify(it.pinyin || []),
        ':explanations': JSON.stringify(it.explanations || []),
        ':level': level,
      },
    );
  });
}

function addPinyinToHanziPos(docs) {
  const pinyinToPosList = {};

  docs.forEach(it => {
    const pos = it.index;
    if (!it.pinyin) {
      console.log('# no pinyin', it);
      return;
    }
    it.pinyin.forEach(pinyin => {
      pinyinToPosList[pinyin] = pinyinToPosList[pinyin] || [];
      pinyinToPosList[pinyin].push(pos);
    });
  });

  Object.entries(pinyinToPosList).forEach(([pinyin, posList]) => {
    posList.forEach(pos => {
      db.run(`insert into pinyin_to_hanzi_pos (pinyin, pos) values (:pinyin, :pos)`, {
        ':pinyin': pinyin,
        ':pos': pos,
      });
    });
  });
}

await import('../../hanzi_lv1.js').then(doc => {
  addHanziTable(doc.default, '1');
  addPinyinToHanziPos(doc.default);
});

await import('../../hanzi_lv2.js').then(doc => {
  addHanziTable(doc.default, '2');
  addPinyinToHanziPos(doc.default);
});

db.close();
