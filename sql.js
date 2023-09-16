const worker = new Worker('/sql/worker.sql-wasm.js');
worker.onmessage = evt => {
  console.log('sqlite ready', evt.data);
};

fetch('/hanzi.db')
  .then(res => res.arrayBuffer())
  .then(buf => {
    worker.postMessage({
      id: 1,
      action: 'open',
      buffer: buf,
    });
  })
  .then(() => {
    setTimeout(() => {
      worker.postMessage({
        id: 2,
        action: 'exec',
        sql: `select * from sqlite_master where type = 'table'`,
      });
    }, 100);
  });
