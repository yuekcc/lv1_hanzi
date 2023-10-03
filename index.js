import debounce from 'lodash.debounce';
import shuffe from 'lodash.shuffle';
import van from 'vanjs-core';
import * as Db from './sql';
import { speak } from './utils';

import './style';

const { div, p } = van.tags;

async function queryHanziPosList() {
  const result = await Db.queryBySql(`select pos from hanzi`);
  return shuffe(result.results[0].values.flat());
}

async function queryHanziByPos(pos) {
  const result = await Db.queryBySql(`select * from hanzi where pos = $pos`, { $pos: pos });
  const data = {};
  const row = result.results?.[0].values[0] || [];
  result.results?.[0].columns.forEach((col, index) => {
    if (col === 'explanations' || col === 'pinyins') {
      data[col] = JSON.parse(row[index] ?? '[]');
      return;
    }

    data[col] = row[index] ?? null;
  });

  return data;
}

await Db.init();
const posList = await queryHanziPosList();

const randomIndex = van.state(null);
const displayHanzi = van.state({});
van.derive(async () => {
  const index = posList[randomIndex.val];
  const hanzi = await queryHanziByPos(index);

  displayHanzi.val = hanzi;
});
randomIndex.val = 0;

const onRead = debounce(() => {
  const hanzi = displayHanzi.val.hanzi;
  speak(hanzi);
}, 200);

function onLookup() {}

function PinyinList(list) {
  if (!Array.isArray(list)) {
    return div('');
  }

  return list.map(pinyin => div({ class: 'tag' }, pinyin));
}

function ExplanationList(list) {
  if (!Array.isArray(list)) {
    return div('');
  }

  let x_ = list.join('\n');

  const dotNumbers = '❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴'.split('');
  dotNumbers.forEach(it => {
    x_ = x_.replaceAll(it, `\n${it} `);
  });

  return x_.split('\n').map((it, index) => p({ 'row-index': index }, it));
}

function TopBar({ onRead, onLookup }) {
  return div(
    { class: 'top-bar' },
    div({}, div({ class: 'btn', onclick: onLookup }, '查')),
    div({ class: 'title' }, '一级汉字'),
    div({}, div({ class: 'btn', onclick: onRead }, '读')),
  );
}

function NextHanzi() {
  const onclick = () => {
    randomIndex.val += 1;
  };

  return div({ class: 'next-button', onclick }, '下一个');
}

const App = () => {
  return div(
    { class: 'hanzi-container', style: `height: 100vh; max-height: 100vh` },

    TopBar({ onRead, onLookup }),
    () => div({ class: 'hanzi' }, displayHanzi.val.hanzi),
    () =>
      div(
        { style: `overflow: auto` },
        div({ class: 'explanations' }, ExplanationList(displayHanzi.val.explanations)),
        div({ class: 'pinyins' }, PinyinList(displayHanzi.val.pinyins)),
      ),
    NextHanzi(),
  );
};

van.add(document.body, App());
