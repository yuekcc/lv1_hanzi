import van from 'vanjs-core';
const { div, p } = van.tags;

const dotNumbers = '❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴'.split('');

export function ExplanationList(list) {
  if (!Array.isArray(list)) {
    return div('');
  }

  let x_ = list.join('\n');

  dotNumbers.forEach(it => {
    x_ = x_.replaceAll(it, `\n${it} `);
  });

  return x_.split('\n').map((it, index) => p({ 'row-index': index }, it));
}
