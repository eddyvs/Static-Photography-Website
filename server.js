const express = require('express')
const app = express()
const port = 3000
const path= require('path')
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})


app.post('/search', (req, res) => {
  console.log('Search received:', req.body.query);
  res.send('Search received: ' + req.body.query);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
