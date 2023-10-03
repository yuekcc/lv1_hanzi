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
