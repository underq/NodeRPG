var socket = io.connect('http://localhost:8333');
var map = new Map('premiere');
// Déclaration du joueur en variable global.
var joueur = 1;

window.onload = function() {
  socket.on('creeNouveauJoueur', function (nouveauJoueur) {
    joueur = new Personnage("personnage.png", nouveauJoueur.id, nouveauJoueur.x, nouveauJoueur.y, DIRECTION.DROITE);
    map.addPersonnage(joueur);
  });

  socket.on('updateOtherJoueurs', function (joueurs) {
    console.log(joueurs.joueurId);
  });
  //socket.on('recupererCoordonnee', function(defaultCoordonnee) {
  //  console.log(defaultCoordonnee);
  //  joueur = new Personnage("personnage.png", defaultCoordonnee.x, defaultCoordonnee.y, DIRECTION.DROITE);
  //  map.addPersonnage(joueur);
  //});

  //socket.on('updateCoordonnee', function (nouvelleCoordonnee) {
  //  joueur = new Personnage("personnage.png", nouvelleCoordonnee.x, nouvelleCoordonnee.y, DIRECTION.DROITE);
  //  map.addPersonnage(joueur);
  //});
  
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  canvas.width = map.getLargeur() * 32;
  canvas.height = map.getHauteur() * 32;

  // Callback de mise à jour de la map toutes les 40 ms.
  setInterval(function() {
    map.dessinerMap(ctx);
    socket.emit('updateAutreJoueurs', {'joueurId': joueur.joueurId});
  }, 40);

  // Detection du clavier.
  window.onkeydown = function(event) {

    var e = event || window.event;
    var key = e.which || e.keyCode;

    switch(key) {
      case 38 : // Flèche haut
	joueur.deplacer(DIRECTION.HAUT, map);
	break;
      case 40 : // Flèche bas
	joueur.deplacer(DIRECTION.BAS, map);
	break;
      case 37 : // Flèche gauche
	joueur.deplacer(DIRECTION.GAUCHE, map);
	break;
      case 39 : // Flèche droite
	joueur.deplacer(DIRECTION.DROITE, map);
	break;
      default : 
	//alert(key);
	// Si la touche ne nous sert pas, nous n'avons aucune raison de bloquer son comportement normal.
	return true;
    }
    return false;
  }
 
}

