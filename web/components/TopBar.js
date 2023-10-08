import van from 'vanjs-core';
const { div, input } = van.tags;

export function TopBar({ onLookup, inputs }) {
  const onInput = e => {
    inputs.val = e.target.value;
    // console.log('onInput, set inputs.val =', inputs.val);
  };

  const onKeyup = e => {
    // console.log('onKeyup', e.isComposing, e.keyCode);
    if (e.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.keyCode === 13) {
      onLookup(inputs.val);
    }
  };

  return div(
    { class: 'top-bar' },
    div({ class: 'title' }, '一级汉字'),
    div(
      { class: 'search' },
      input({
        placeholder: '查字或查用拼音查字',
        value: () => inputs.val,
        oninput: onInput,
        onkeyup: onKeyup,
      }),
    ),
  );
}
