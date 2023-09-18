const worker = new Worker('/sql/worker.sql-wasm.js');

const nextId = (function () {
  let x = 0;
  return () => {
    x += 1;
    return x;
  };
})();

const callbackMap = new Map();
const dbState = {
  ready: false,
  callbacksBeforeReady: [],
};

worker.onmessage = evt => {
  const { id, ...data } = evt.data;
  const callback = callbackMap.get(id);
  callback(data);

  callbackMap.delete(id);
};

function openDatabase(buf) {
  return new Promise(resolve => {
    const id = nextId();
    callbackMap.set(id, data => resolve(data));

    worker.postMessage({
      id,
      action: 'open',
      buffer: buf,
    });
  });
}

/**
 * 通过 sql 查询数据
 * @param {string} sql
 * @param {object | null} params
 * @returns {{results: Array<{values: any[], columns: string[]}>}}
 */
export function queryBySql(sql, params = null) {
  return new Promise(resolve => {
    const fn = () => {
      const id = nextId();
      callbackMap.set(id, data => resolve(data));

      worker.postMessage({
        id,
        action: 'exec',
        sql,
        params: params || {},
      });
    };

    if (dbState.ready) {
      fn();
    } else {
      dbState.callbacksBeforeReady.push(fn);
    }
  });
}

export async function init() {
  const buf = await fetch('/hanzi.db').then(res => res.arrayBuffer());

  await openDatabase(buf);
  dbState.ready = true;

  if (dbState.callbacksBeforeReady.length > 0) {
    dbState.callbacksBeforeReady.forEach(cb => cb());
  }
}
