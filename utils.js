export function makeRandomNumberGenerator(max) {
  return () => {
    let random = Math.random();
    let randomNumber = Math.floor(random * max);

    return randomNumber;
  };
}

const speakList = [];

const speakDefaultOptions = {
  lang: 'zh-CN',
  volume: 1,
  rate: 1,
  pitch: 1,
};

function _speak(text, opts = speakDefaultOptions) {
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
  const speechSynthesis = window.speechSynthesis;

  const ssu = new SpeechSynthesisUtterance();
  ssu.lang = opts.lang;
  ssu.volume = opts.volume;
  ssu.rate = opts.rate;
  ssu.pitch = opts.pitch;
  ssu.text = text;
  speechSynthesis.speak(ssu);
}

export function speak(text) {
  speakList.push(text);
  setTimeout(() => {
    while (speakList.length > 0) {
      if (window.speechSynthesis.speaking) {
        continue;
      }

      const content = speakList.pop();
      _speak(content);
    }
  });
}
