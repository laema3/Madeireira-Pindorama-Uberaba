fetch('https://kvdb.io/', { method: 'POST' })
  .then(res => console.log('Bucket URL:', res.url))
  .catch(err => console.error(err));
