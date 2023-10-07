import van from 'vanjs-core';
const { div } = van.tags;

export function PinyinList({ list, onClick }) {
  if (!Array.isArray(list)) {
    return div('');
  }

  return list.map(pinyin => div({ class: 'tag', role: 'button', onclick: () => onClick(pinyin) }, pinyin));
}
