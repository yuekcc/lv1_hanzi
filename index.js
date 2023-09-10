import van from 'vanjs-core';
import HanziDb from './db';
import { makeRandomNumberGenerator, speak } from './utils';
import debounce from 'lodash.debounce';

const { div } = van.tags;

const hanziCount = HanziDb.length;

const generateRandomNumber = makeRandomNumberGenerator(hanziCount);

const randomIndex = van.state(generateRandomNumber());
const displayHanzi = van.derive(() => {
  const index = randomIndex.val;
  return HanziDb[index];
});

const onRead = debounce(() => {
  const hanzi = displayHanzi.val.hanzi;
  speak(hanzi);
}, 200);

function onLookup() {}

const dotNumbers = '❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴'.split('');
function ExplanationList(list) {
  let x_ = list.join('\n');
  dotNumbers.forEach(it => {
    x_ = x_.replaceAll(it, `\n${it} `);
  });

  return x_.split('\n').map(it => div(it));
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
    randomIndex.val = generateRandomNumber();
  };

  return div({ class: 'next-button', onclick }, '下一个');
}

const App = () => {
  return div(
    { class: 'hanzi-container', style: `height: 100vh; max-height: 100vh` },

    TopBar({ onRead, onLookup }),
    div({ class: 'hanzi' }, () => displayHanzi.val.hanzi),
    () => div({ class: 'explanation' }, ExplanationList(displayHanzi.val.explanations)),
    NextHanzi(),
  );
};
van.add(document.body, App());
