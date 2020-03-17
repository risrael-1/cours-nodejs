const express = require('express')
const app = express()

app.use(express.json()) // for parsing application/json

const PORT = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hello', function(req, res){
	if(req.query.nom){
		res.send("Bonjour " + req.query.nom + "!\n");
	}else{
		res.send("Quel es ton nom ?\n");
	}
});

app.post('/chat', function (req, res) {
	if (req.body.msg === 'ville') {
	  res.send('Nous sommes à Paris')
	} else if (req.body.msg === 'météo') {
	  res.send('Il fait beau')
	} else {
	  res.send(req.body.msg)
	}
  })

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})