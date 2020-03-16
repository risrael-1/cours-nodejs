const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hello/:nom', function (req, res) {
    if(res.param.nom)
    {
        res.send('Bonjour !', req.param.nom)
    } else {
        res.send('Quel est votre nom ?')
    }
  })

app.listen(PORT, function () {
  console.log('Example app listening on port ${PORT} !')
})