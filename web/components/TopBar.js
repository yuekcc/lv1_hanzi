import van from 'vanjs-core';
const { div, input } = van.tags;

export function TopBar({ onLookup, inputs }) {
  const onInput = e => {
    if (e.isComposing) {
      return;
    }

    inputs.val = e.target.value;
  };

  const onKeyup = e => {
    if (e.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === 'Enter') {
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
