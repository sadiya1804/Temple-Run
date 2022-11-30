

/**
 * Tableau contenant toute les images utilisé pour représenté
 * les zone vide dans le premier environnement (eau verte)
 */
const imagesEmpty1 = [
    createImg("images/empty1.png"),
    createImg("images/emptyD.png"),
    createImg("images/emptyG.png"),
    createImg("images/emptyCoinHD.png"),
    createImg("images/emptyCoinHG.png"),
    createImg("images/emptyB.png"),
    createImg("images/emptyH.png")
];

/**
 * Tableau contenant toute les images utilisé pour représenté
 * les zone vide dans le deuxième environnement (eau bleu)
 */
const imagesEmpty2 = [
    createImg("images/empty2.png"),
    createImg("images/empty2D.png"),
    createImg("images/empty2G.png"),
    createImg("images/empty2HD.png"),
    createImg("images/empty2HG.png"),
    createImg("images/empty2B.png"),
    createImg("images/empty2H.png")
];

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant le vide à coté de la route
 */
const EMPTY = {
    img:imagesEmpty1[0], // image de base
    imgD:imagesEmpty1[1], // image quand il y a une route à Droite
    imgG:imagesEmpty1[2], // image quand il y a une route à gauche
    imgCD:imagesEmpty1[3], // image quand il y a une route à Droite et au dessus
    imgCG:imagesEmpty1[4], // image quand il y a une route à Gauche et au dessus
    imgB:imagesEmpty1[5], // image quand il y a une route en dessous
    imgH:imagesEmpty1[6] // image quand il y a une route au dessus
} ;

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant la route (type0)
 */
const ROAD = {
    imgD: createImg("images/S3.png"),
    imgM: createImg("images/S2.png"),
    imgG: createImg("images/S1.png"),
    imgS: createImg("images/S7.png")
};

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant la route (type1)
 */
const ROAD1 = {
    imgD: createImg("images/S6.png"),
    imgM: createImg("images/S5.png"),
    imgG: createImg("images/S4.png"),
    imgS: createImg("images/S7.png")
};

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant du joueur, img change en fonction de l'action du player (sauter, glisser ,...)
 */
const PLAYER = {img: createImg("images/p2.png")};

/**
 * Tableau contenant toutes les images possible pour le joueur
 */
const imagePlayer = {
    img1:createImg("images/p1.png"),
    img2:createImg("images/p2.png"),
    imgD1:createImg("images/pD1.png"),
    imgD2:createImg("images/pD2.png"),
    imgG1:createImg("images/pG1.png"),
    imgG2:createImg("images/pG2.png"),
    imgUp:createImg("images/pUP.png"),
    imgDown:createImg("images/pDown.png"),
};

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant l'obstacle du feu
 */
const FEU = {
    imgDD: createImg("images/Feu4.png"),
    imgD: createImg("images/Feu3.png"),
    imgM: createImg("images/Feu2.png"),
    imgG: createImg("images/Feu1.png"),
    imgGG: createImg("images/Feu0.png")
};

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant l'obstacle du branche
 */
const BRANCHE = {
    imgDD: createImg("images/branche5.png"),
    imgD: createImg("images/branche4.png"),
    imgM:createImg("images/branche3.png"),
    imgG:createImg("images/branche2.png"),
    imgGG:createImg("images/branche1.png")
};

/**
 * Objet contenant les images des troue suivant les environnement
 */
const imagesTrou = {
    imgD: createImg("images/trou3.png"),
    imgM: createImg("images/trou2.png"),
    imgG: createImg("images/trou1.png"),
    imgD1: createImg("images/2trou3.png"),
    imgM1: createImg("images/2trou2.png"),
    imgG1: createImg("images/2trou1.png")
};

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant l'obstacle trou (les image changent suivant l'environnement)
 */
const TROU = {
    imgD: imagesTrou.imgD,
    imgM: imagesTrou.imgM,
    imgG: imagesTrou.imgG
};

/**
 * Objet utiliser dans le tableau world et pour l'affichage
 * représentant l'obstacle arbre
 */
const ARBRE ={
    imgD: createImg("images/arbre4.png"),
    imgM: createImg("images/arbre3.png"),
    imgG: createImg("images/arbre2.png"),
    imgS: createImg("images/arbre1.png")
};

/**
 * Objet contenant les images ou sont écrit les aides utilisé pendant le tutoriel
 */
const TutorielImages = {
    imgTournerG:createImg("images/TournerG.gif"),
    imgTournerD:createImg("images/tournerD.gif"),
    imgSauter:createImg("images/Sauter.gif"),
    imgGlisser:createImg("images/glisser.gif")
};

/** 
 *  Cette fonction retourne un element HtMl avec pour source l'argument
 * 
 * @param source ou se trouve l'image
*/
function createImg(source){
    let image = new Image();
    image.src = source;
    return image;
}