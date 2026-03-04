fetch('https://api.npoint.io/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ test: 1 })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
