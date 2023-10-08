import fs from 'fs/promises';

const lv1Hanzis = await fs.readFile('../level-2.txt', 'utf-8').then(doc => doc.split('\n'));

const hanziToPinyinMap = await fs
  .readFile('../8105无字频.dict.yaml', 'utf-8')
  .then(doc => doc.split('\n'))
  .then(data =>
    data.reduce((map, line) => {
      const [hanzi, pinyin] = line.split(/\s+/);
      if (Array.isArray(map[hanzi])) {
        map[hanzi].push(pinyin);
      } else {
        map[hanzi] = [pinyin];
      }

      return map;
    }, {}),
  );

const dict = await fs.readFile('../XDHYCD7th.txt', 'utf-8').then(text => text.split('\n'));

const result = [];

lv1Hanzis.forEach((hanzi, index) => {
  const pinyin = hanziToPinyinMap[hanzi];
  result.push({
    index: 3501 + index,
    hanzi,
    pinyin,
    explanations: dict.filter(it => it.startsWith(`【${hanzi}】`)),
  });
});

await fs.writeFile('../../hanzi_lv2.js', `export default ${JSON.stringify(result, null, 2)}`, 'utf-8');
