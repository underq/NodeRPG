var http = require('http');
var fs = require('fs');
var mime = require('mime');

// Création du server.
var app = http.createServer(function (req, res) {
  // Get URL.
  var filePath = './public' + req.url;

  // Set default path.
  if (filePath == './public/') {
    filePath = './public/index.html';
  }

  fs.exists(filePath, function (exists) {
    if (exists) {
      fs.readFile(filePath, 'utf-8', function (error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
          console.log('500: ' + filePath);
        }
        else {
	  if (mime.lookup(filePath) == "image/png") {
            content = fs.readFileSync(filePath);
            res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
            res.end(content, 'binary');
            console.log('200 - Image :' +filePath);
          } else {
            res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
            res.end(content);
            console.log('200 :' + filePath);
          }
        }
      });
    }
    else {
      console.log('404: ' + filePath);
      res.writeHead(404);
      res.end();
    }
  });

});

var io = require('socket.io').listen(app);
var nouveauJoueur = {'id': 0, 'x': 1, 'y': 1};

// Listes des joueurs connecté.
var joueurs = new Array();

io.sockets.on('connection', function (socket) {
  // Set joueurId.
  nouveauJoueur.id = socket.id;
  console.log(nouveauJoueur);

  socket.emit('creeNouveauJoueur', nouveauJoueur);

  socket.on('updateCoordonnee', function (coordonnee) {
     // Mise à jour des coordonnées.
     joueurs[coordonnee.joueurId] = coordonnee;
     console.log(joueurs);

     socket.broadcast.emit('updateOtherJoueurs', joueurs);

     // Envoie des nouvelles coordonnée au autre client.
    //socket.broadcast.emit('updateCoordonnee', coordonnee);
  });
 
});

app.listen(8333);
console.log('App running at http://localhost:8333');
