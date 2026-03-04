fetch('https://api.jsonbin.io/v3/b', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Bin-Private': 'false'
  },
  body: JSON.stringify({ test: 1 })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
