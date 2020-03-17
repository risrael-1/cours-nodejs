const fs = require('fs')
const express = require('express')
const app = express()

app.use(express.json()) // for parsing application/json

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hello', function (req, res) {
  const nom = req.query.nom
  if (nom) {
    res.send('Bonjour, ' + nom + ' !')
  } else {
    res.send('Quel est votre nom ?')
  }
})

app.post('/chat', function (req, res) {
  if (req.body.msg === 'ville') {
    res.send('Nous sommes à Paris')
  } else if (req.body.msg === 'météo') {
    res.send('Il fait beau')
  } else {
    if (/ = /.test(req.body.msg)) {
      const [ cle, valeur ] = req.body.msg.split(' = ')
      const valeursExistantes = readValuesFromFile();
      fs.writeFileSync('réponses.json', JSON.stringify({
        ...valeursExistantes,
        [cle]: valeur
      }))
      res.send('Merci pour cette information !')
    } else {
      const cle = req.body.msg
      const reponse = readValuesFromFile()[cle]
      res.send(cle + ': ' + reponse)
    }
  }
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

function readValuesFromFile() {
  const reponses = fs.readFileSync('réponses.json', { encoding: 'utf8' });
  const valeursExistantes = JSON.parse(reponses);
  return valeursExistantes;
}