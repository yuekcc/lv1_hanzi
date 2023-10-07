import van from 'vanjs-core';
import { queryHanziPosListByHanzi } from './utils';
const { div } = van.tags;

export function FindHanzi({ keyword, onShowDetail }) {
  const hanziList = van.state([]);

  queryHanziPosListByHanzi(keyword).then(list => {
    hanziList.val = list;
  });

  return div({}, () =>
    div(
      { class: 'search-result' },
      hanziList.val.map(info => {
        return div({ role: 'button', onclick: () => onShowDetail(info) }, info.hanzi);
      }),
    ),
  );
}
