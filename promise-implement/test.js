var promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('hahaha');
  }, 100);
});

promise.then((data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data + 'xixi');
    }, 1000);
  });
}).then((data) => {
  console.log('ppp', data);
});