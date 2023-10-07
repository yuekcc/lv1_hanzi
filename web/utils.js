import * as Db from './sql';
import shuffe from 'lodash.shuffle';

export async function queryHanziPosList() {
  const result = await Db.queryBySql(`select pos from hanzi`);
  return shuffe(result.results[0]?.values.flat());
}

async function _queryHanziPosListByPinyin(pinyin) {
  const sql = `select pos from pinyin_to_hanzi_pos where pinyin = $pinyin`;
  const result = await Db.queryBySql(sql, { $pinyin: pinyin });
  const posList = result.results[0]?.values.flat() || [];

  if (posList.length === 0) {
    return [];
  }

  return Promise.all(posList.map(queryHanziByPos));
}

async function _queryHanziPosListByHanzi(hanzi) {
  const res = await Db.queryBySql(
    `select id,hanzi,pos,pinyins,explanations from hanzi where hanzi = $hanzi`,
    { $hanzi: hanzi },
  );

  const rows = res.results[0]?.values || [];
  const result = rows.map(row => {
    const data = {};
    res.results?.[0].columns.forEach((col, index) => {
      if (col === 'explanations' || col === 'pinyins') {
        data[col] = JSON.parse(row[index] ?? '[]');
        return;
      }

      data[col] = row[index] ?? null;
    });

    return data;
  });

  return result;
}

export async function queryHanziPosListByHanzi(keyword) {
  const byHanzi = await _queryHanziPosListByHanzi(keyword);
  const byPinyin = await _queryHanziPosListByPinyin(keyword);
  return [...byHanzi, ...byPinyin];
}

export async function queryHanziByPos(pos) {
  const result = await Db.queryBySql(`select id,hanzi,pos,pinyins,explanations from hanzi where pos = $pos`, {
    $pos: pos,
  });
  const data = {};
  const row = result.results[0]?.values[0] || [];
  result.results?.[0].columns.forEach((col, index) => {
    if (col === 'explanations' || col === 'pinyins') {
      data[col] = JSON.parse(row[index] ?? '[]');
      return;
    }

    data[col] = row[index] ?? null;
  });

  return data;
}

export function makeRandomNumberGenerator(max) {
  return () => {
    let random = Math.random();
    let randomNumber = Math.floor(random * max);

    return randomNumber;
  };
}

const speakDefaultOptions = {
  lang: 'zh-CN',
  volume: 1,
  rate: 1,
  pitch: 1,
};

function _speak(text, opts = speakDefaultOptions) {
  const ssu = new window.SpeechSynthesisUtterance();
  ssu.lang = opts.lang;
  ssu.volume = opts.volume;
  ssu.rate = opts.rate;
  ssu.pitch = opts.pitch;

  ssu.text = text;
  window.speechSynthesis.speak(ssu);
}

export function speak(text) {
  window.speechSynthesis.cancel();

  _speak(text);
}
