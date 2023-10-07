import van from 'vanjs-core';
import debounce from 'lodash.debounce';
import { PinyinList } from './components/PinyinList';
import { ExplanationList } from './components/ExplanationList';

import { speak, queryHanziByPos, queryHanziPosList } from './utils';

const { div, p } = van.tags;

const posList = await queryHanziPosList();

const randomIndex = van.state(0);
const displayHanzi = van.state({});
van.derive(async () => {
  const randomIndex_ = randomIndex.val;
  if (randomIndex_ === null) {
    return;
  }

  const index = posList[randomIndex_];
  const hanzi = await queryHanziByPos(index);

  displayHanzi.val = hanzi;
});

const onRead = debounce(() => {
  const hanzi = displayHanzi.val.hanzi;
  speak(hanzi);
}, 200);

function NextHanzi() {
  const onclick = () => {
    randomIndex.val += 1;
  };

  return div({ class: 'next-button', role: 'button', onclick }, '下一个');
}

export const RandomHanzi = ({ current, findHanziByPinyin }) => {
  if (current >= 0) {
    const found = posList.findIndex(it => it === current);
    if (found > -1) {
      randomIndex.val = found;
    }
  } else {
    randomIndex.val = 0;
  }

  return div(
    { class: 'hanzi-container' },
    () =>
      div(
        { class: 'hanzi-wrapper' },
        div({ class: 'hanzi' }, displayHanzi.val.hanzi),
        div({ class: 'pinyins' }, PinyinList({ list: displayHanzi.val.pinyins, onClick: findHanziByPinyin })),
      ),
    () =>
      div(
        { style: `overflow: auto; padding: 1rem 1rem 2rem 1rem` },
        div({ class: 'explanations' }, ExplanationList(displayHanzi.val.explanations)),
        div({ class: 'tools' }, div({ role: 'button', onclick: onRead }, '朗读')),
      ),
    NextHanzi(),
  );
};
