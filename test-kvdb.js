fetch('https://kvdb.io/', { method: 'POST', redirect: 'manual' })
  .then(res => {
    console.log('Status:', res.status);
    console.log('Location:', res.headers.get('location'));
  })
  .catch(err => console.error(err));
