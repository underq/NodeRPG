function Tileset(url) {
  this.image = new Image();
  this.image.referenceDuTileset = this;
  this.image.onload = function () {
    if(!this.complete)
      throw new Error("Erreur de chargement du tileset");
    // Largeur du tileset en tiles
    this.referenceDuTileset.largeur = this.width / 32;
  }
  this.image.onerror = function () {
    throw new Error("Erreur de chargement du tileset");
  }
  this.image.src = "tileset/" + url;
}

// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées x et y
Tileset.prototype.dessinerTile = function(numero, context, xDestination, yDestination) {

  var xSourceEnTiles = numero % this.largeur;
  if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;

  var ySourceEnTiles = Math.ceil(numero / this.largeur);

  var xSource = (xSourceEnTiles - 1) * 32;
  var ySource = (ySourceEnTiles - 1) * 32;

  context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);
}
