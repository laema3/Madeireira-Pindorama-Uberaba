fetch('https://jsonkeeper.com/b', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ test: 1 })
})
.then(res => res.text())
.then(data => console.log(data))
.catch(err => console.error(err));
