const fs = require('fs')
const util = require('util')
const express = require('express')
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'chat-bot';
const COLLECTION_NAME = 'messages';

const app = express();

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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

app.get('/messages/all', async function (req, res) {

  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);
  console.log('successfully connected to', DATABASE_NAME);

  const messages = await collection.find({}).toArray();
  // await collection.insertOne({ date: new Date() });

  await client.close();

  res.send(messages)
})

app.post('/chat', async function (req, res) {
  if (req.body.msg === 'ville') {
    res.send('Nous sommes à Paris')
  } else if (req.body.msg === 'météo') {
    res.send('Il fait beau')
  } else {
    if (/ = /.test(req.body.msg)) {
      const [ cle, valeur ] = req.body.msg.split(' = ')
      let valeursExistantes
      try {
        valeursExistantes = await readValuesFromFile();
      } catch (err) {
        res.send('error while reading réponses.json', err)
        return
      }
      const data = JSON.stringify({
        ...valeursExistantes,
        [cle]: valeur
      })
      try {
        await writeFile('réponses.json', data)
        res.send('Merci pour cette information !')
      } catch (err) {
        console.error('error while saving réponses.json', err)
        res.send('Il y a eu une erreur lors de l\'enregistrement')
      }
    } else {
      const cle = req.body.msg
      try {
        const values = await readValuesFromFile()
        const reponse = values[cle]
        res.send(cle + ': ' + reponse)
      } catch (err) {
        res.send('error while reading réponses.json', err)
      }
    }
  }
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

async function readValuesFromFile() {
  const reponses = await readFile('réponses.json', { encoding: 'utf8' })
  return JSON.parse(reponses)
}