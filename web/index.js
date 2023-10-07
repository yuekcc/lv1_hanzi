import van from 'vanjs-core';

import '../style';

import { RandomHanzi } from './RandomHanzi';
import { FindHanzi } from './FindHanzi';
import { TopBar } from './components/TopBar';

const { div } = van.tags;

function App() {
  const searchKeyword = van.state('');
  const currentShowingHanziPost = van.state(null);

  function onLookup(keyword) {
    searchKeyword.val = keyword;
  }

  function onShowDetail(info) {
    currentShowingHanziPost.val = info.pos;
    searchKeyword.val = '';
  }

  return div(
    { class: 'main-container' },
    () => TopBar({ onLookup, inputs: searchKeyword }),
    () => {
      const searchKeyword_ = searchKeyword.val;
      const currentShowingHanziPost_ = currentShowingHanziPost.val;

      if (searchKeyword_) {
        return FindHanzi({ keyword: searchKeyword_, onShowDetail });
      }

      return RandomHanzi({ current: currentShowingHanziPost_, findHanziByPinyin: onLookup });
    },
  );
}

van.add(document.body, App());
