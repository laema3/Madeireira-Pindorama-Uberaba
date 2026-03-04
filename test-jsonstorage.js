fetch('https://api.jsonstorage.net/v1/json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ test: 1 })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
