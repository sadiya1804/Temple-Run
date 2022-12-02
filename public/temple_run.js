
// On définit la taille de la des cases du Cannevas en fonction de la taille de la fenêtre
let size = calculeTailleCaseCanvas();

// On récupère le bouton qui permet de lancer le jeu
const bt = document.getElementById('button1');

// Image ou l'on mets le gif d'instruction pour le tutoriel
const imageTuto = document.getElementById('aideTuto');

// Ecran qu'on affiche lors de la mort du personnage
const screenGameOver = document.getElementById('gameOver');
// Section contenant les bouttons pour choisir si on veut ou pas faire le tuto
const fenetreTuto = document.getElementById("choixTuto");

// variable servant à stocker l'identifiant générer lors de la création de l'intervale pour le jeu
let jeuID;

// récupération du canva
let canvas = document.getElementById('zoneJeu');
// mise en place de l'environnement 2D
let ctx = canvas.getContext('2d');
// initialisation de la variable run, run représente quand le jeu tourne 
let run = false;

/**
 * Cette fonction calcule la taille des cases, pour que le jeu fasse la taille maximum
 * récupére la hauteur et la largeur de la page et divise par les dimensions du tableau
 * on retourne la taille la plus basse, Comme ça le jeu s'affiche soit sur toute la hauteur 
 * soit sur toute la largeur.
 * 
 * @returns la valeur a utiliser comme nouvelle taille des case
 */
function calculeTailleCaseCanvas(){
    h = window.innerHeight;
    w= window.innerWidth;
    h=Math.floor(h/10);
    w=Math.floor(w/7);

    return Math.min(h,w);
}

// Variable qui correspond au nombre de tour avant qu'il y ai un nouveau piege
let prochainPiege=0;

// Contient le prochain type de route entre (ROAD et ROAD1)
let nextRoad = ROAD;

// quand cette variable vos 1 ça signifie que les route a créer doivent être vide
let stopRoute = -1;


// Objet qui contient tout les élements relatifs à la difficulté du jeu
let difficulté = {
    saut: 20, // correspond au nombre d'itération sauter avant de faire défiler les lignes (plus cette variable est basse plus le jeu va vite)
    tour:10, // correspond au nombre de tour avant que la difficulter augmente (-> saut diminu)
    boucle:0 // correspond au nombre d'itération effectué
}


/**
 * Objet contenant toute les informations relative au joueur
 */
let player  = {
    posX: 3, // position x dans le tableau
    posY: 1, // position y dans le tableau
    saut:0,  // entier qui et incrémenter quand le joueur saute (0 = default)
    glisse:0, // entier qui et incrémenter quand le joueur glisse (0 = default)
    direction:0 // variable utiliser pour les moments ou on press une des flèches (droite et gauche)
};

// le score augmente tout au long de la partie et est afficher en fin de jeu
let score = 0;
// contient l'url de l'image a afficher lors du game over (change en fonction de comment on meurt)
let sourceImageGameOver;

// Tableau contenant tout les cases qu'on affiche dans le canvas
let WORLD = [
    [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, PLAYER, ROAD, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY]
  ];

//// ######### Mise en place évenement pour les mouvements dans le jeu ##########

/**
 * Ajout des évenements clavier
 */
document.addEventListener('keydown', function(evt){
    if (run){
        evt.preventDefault();
        if (evt.key == 'ArrowLeft'){ // Quand la touche gauche est enfoncé
            player .direction = +2; 
            actionGauche(); 
            basculerAgauche();
        }
        if (evt.key == 'ArrowRight'){ //  Quand la touche droite est enfoncé
            player .direction = -2;
            actionDroite();
            basculerAdroite();
        }
        if (evt.key == 'ArrowUp' || evt.key == ' '){ // Quand la touche flèche vers le haut est enfoncé
            sauter();
        }
        if (evt.key == 'ArrowDown'){ // Quand la touche flèche vers le bas est enfoncé
            glisser();
        }
        draw();
    }
    evt.d
    //console.log(evt.key );
});

/**
 * Ajout des évenements Tactils
*/
console.log("Tactil actif");
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('touchcancel', handleCancel);
canvas.addEventListener('touchmove', handleMoove);

let ongoingTouche = null; // correspond a un elmt Touch (on en garde que un parce qu'il n'y a pas besoin de plusieur doigt pour jouer a ceux jeu)

function handleStart(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    if (ongoingTouche == null){
        ongoingTouche = copyTouch(touches[0]);
    }
  }

function handleEnd(evt) {
  evt.preventDefault();
  const touches = evt.changedTouches;
    
  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      diffX = touches[i].pageX - ongoingTouche.pageX;
      diffY = touches[i].pageY - ongoingTouche.pageY;

      if (Math.abs(diffX)>=Math.abs(diffY)){
        if (diffX>0){
          console.log("glisse_Droite");
          player .direction = -2;
          actionDroite();
        }
        else{
          console.log("glisse_Gauche");
          player .direction = +2;
          actionGauche();
        }
      }else{
        if (diffY>0){
          console.log("glisse_Bas");
          glisser();
        }
        else{
          console.log("glisse_Haut");
          sauter();
        }
      }
      ongoingTouche = null;
    }  else {
      console.log(`impossible de déterminer le point de contact à faire avancer`);
    }
  }
}

/**
 * Quand un evement touchMove est enclenché on appele cette méthode
 * En comparant les coordonnées des Touchs on détermine si l'utilisateur a glisser vers me haut, le bas, la droite, la gauche
 * et on appelle la fonction qui correspond
 * @param {*} evt 
 */
function handleMoove(evt) {
    evt.preventDefault();
  
    const touches = evt.changedTouches;
      
    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        diffX = touches[i].pageX - ongoingTouche.pageX;
        diffY = touches[i].pageY - ongoingTouche.pageY;
  
        if (Math.abs(diffX)>=Math.abs(diffY)){
          if (diffX>0){
            console.log("glisse_Droite");
            player .direction = -2;
            actionDroite();
          }
          else{
            console.log("glisse_Gauche");
            player .direction = +2;
            actionGauche();
          }
        }else{
          if (diffY>0){
            console.log("glisse_Bas");
            glisser();
          }
          else{
            console.log("glisse_Haut");
            sauter();
          }
        }
      }  else {
        console.log(`impossible de déterminer le point de contact à faire avancer`);
      }
    }
  }

function handleCancel(evt){
  evt.preventDefault();

  const touches = evt.changedTouches;
    
  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      ongoingTouche=null;
    }
  }
}

/**
 * vérifie que l'id de la touch passé en parametre correspond a la précedente Touch (c'est toujours le même doigt qui touche l'écran)
 */
function ongoingTouchIndexById(idToFind) {
  if (ongoingTouche.identifier == idToFind) {
    return ongoingTouche.identifier;
  }
  return -1;  
}

/** Duplique un élement Touch */
function copyTouch({ identifier, pageX, pageY }) { 
  return { identifier, pageX, pageY };
}



// ##### partie tutoriel ######

var tutoriel = -1; // suivant la valeur on sait si le tutoriel est actif ou pas
// parcours du tutoriel ( au lieu de générer aléatoirement la route pour le tutoriel on utilise la liste suivante pour les premières lignes)
var chemin = [ 
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    cheminAGauche(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    cheminADroite(ROAD1),  
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(BRANCHE),
    générerLigne(ROAD1),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ARBRE),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(FEU),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(ROAD1),
    générerLigne(ROAD),
    générerLigne(TROU),

];

/**
 * Cet fonction créai une ligne correspondant à l'obstacle en paramètre
 * 
 * @param {*} obstacle type object correspondant a ce qu'il y a sur la ligne (arbre, trou, route,...)
 * @returns tableau de valeur corrrespondant a une ligne pour aller dans le tableau World
 */
function générerLigne(obstacle){
    return [EMPTY,EMPTY,obstacle,obstacle,obstacle, EMPTY, EMPTY];
}

 

/**
 * La fonction jeu est appeler dans un interval elle permet d'augmenter le score et
 * mettre à jour la difficulter c'est cette fonction qui vas appeler la fonction qui ajoute une Ligne
 */
 function Jeu(){
    if (run){
            difficulté.boucle++;
            if (difficulté.boucle%difficulté.saut == 0){
                score++;
                difficulté.tour--;
                AjoutLigne();
                
                if (difficulté.tour==0){
                    difficulté.saut--;
                    difficulté.tour=10 * (20- difficulté.saut)
                }
            }
        
    }
}

// Ajout à tout les boutons Jouer l'évement permettant de lancer le jeu
(document.querySelector("#gameOver button")).addEventListener('click',lancerJeu);
(document.querySelector("#rêgleJeu button")).addEventListener('click',lancerJeu);
bt.addEventListener('click',lancerJeu);

// Ajout au bouton voir Rêgle un évenement 'click' pour afficher la section avec les rêgles
(document.getElementById("button2")).addEventListener('click',function(){
    (document.querySelector("#titre")).style.display = "none";
    screenGameOver.style.display = "none";
    canvas.style.display = "none";
    imageTuto.style.display = "none";
    (document.querySelector("#rêgleJeu")).style.display = "block";

});

// Ajout au bouton retour un évenement 'click' pour ré-afficher l'écran tittre
(document.querySelector("#retour")).addEventListener('click',function(){
    (document.querySelector("#rêgleJeu")).style.display = "none";
    screenGameOver.style.display = "none";
    canvas.style.display="none";
    imageTuto.style.display = "none";
    (document.querySelector("#titre")).style.display = "block";
});

/**
 * Ajout d'un listener sur la fenetre pour le choix du tuto pour capter quand l'utilisateur fait
 * son choix entre faire ou ne pas faire le tutoriel
 * 
 * suite au choix le jeu est lancer grace à la fonction lancerJeu()
 */
fenetreTuto.addEventListener('click',function(evt){
    switch(evt.target.tagName){
        case "BUTTON":
            if(evt.target.textContent == " Oui "){
                tutoriel = true;}
            else{
                tutoriel = false;}
            lancerJeu();
            break;
    }
})

/**
 * Si on a pas fait le choix pour le tutoriel on affiche la fenetre permettant de faire le choix 
 * 
 * Sinon on affiche le canvas et on initialise le jeu et on désaffiche les autres sections
 */
function lancerJeu(){
    if (tutoriel==-1){
        console.log("choixTutoriel");
        return fenetreTuto.style.display = "block";}
    screenGameOver.style.display = "none";
    fenetreTuto.style.display = "none";
    (document.querySelector("#rêgleJeu")).style.display = "none";
    (document.querySelector("#titre")).style.display = "none";
    size = calculeTailleCaseCanvas();
    canvas.height = WORLD.length*size;
    canvas.width = WORLD[0].length*size;
    var largeurWin = window.innerWidth;
    var hauteurWin = window.innerHeight;
    if (tutoriel){
        imageTuto.style.display= "block";
        imageTuto.style.left =  Math.floor((largeurWin-canvas.width)/2) + 'px';
        imageTuto.style.height= Math.floor(size*3) + 'px';
        imageTuto.style.width=canvas.width+"px";
        }
    if (hauteurWin<canvas.height){
        canvas.style.bottom = '0px';
        screenGameOver.style.bottom ='0px';
        screenGameOver.style.height = hauteurWin+'px';
    }else{
        canvas.style.bottom = Math.floor((hauteurWin-canvas.height)/2) + 'px';
        screenGameOver.style.bottom = Math.floor((hauteurWin-canvas.height)/2) + 'px';
        screenGameOver.style.height = canvas.height + 'px';
    }
    canvas.style.left = Math.floor((largeurWin-canvas.width)/2) + 'px';
    screenGameOver.style.left = Math.floor((largeurWin-canvas.width)/2) + 'px';
    screenGameOver.style.width = canvas.width + 'px';
    canvas.style.position = 'fixed';
    canvas.style.display = 'block';
    screenGameOver.style.height = 
    initJeu();
    jeuID = setInterval(Jeu,30);
    run = true;

};

/**
 * Retourne l'éléments à la ligne posY du tableau WORLD
 * @param posY 
 * @returns ceux que contient l'une des cases de la ligne posY du tableau
 */
function quelleObstacleAlaLigne(posY){    
    switch(player .posX){
        case 2:
        case 3:
            posX=4;
            break;
        case 4:
            posX=2;
            break;
        default:
            posX=-1;
    }
    if (posY<0||posX<0||posY>9)
        return -1;
    return WORLD[posY][posX];
}

/**
 * Cette fonction permet de dessiner dans le canvas tout le jeu
 */
function draw(){
    let l = 0;
    let c =0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (l=0;l<WORLD.length;l++){
        for (c=0;c<WORLD[l].length;c++){
            cell = WORLD[l][c];
            ctx.fillStyle = cell;
            switch(cell){
                case ROAD:
                case ROAD1:
                    if (c == 2){
                        ctx.drawImage(cell.imgG,size*c,size*(WORLD.length-l-1),size,size);
                        if (quelleObstacleAlaLigne(l-1)==ARBRE){
                            ctx.drawImage(ARBRE.imgS,size*c,size*(WORLD.length-l-1),size,size);}}
                    else if (c == 4)
                        ctx.drawImage(cell.imgD,size*c,size*(WORLD.length-l-1),size,size);
                    else if (c == 3)
                        ctx.drawImage(cell.imgM,size*c,size*(WORLD.length-l-1),size,size);
                    else 
                        ctx.drawImage(cell.imgS,size*c,size*(WORLD.length-l-1),size,size);
                    break;

                case EMPTY:
                    if (c == 1 && WORLD[l][2]!=EMPTY){
                        
                        if (l+1<WORLD.length &&(WORLD[l+1][c] !=EMPTY))
                            ctx.drawImage(EMPTY.imgCD,size*c,size*(WORLD.length-l-1),size,size);
                        else
                            ctx.drawImage(EMPTY.imgG,size*c,size*(WORLD.length-l-1),size,size);
                        

                        if (quelleObstacleAlaLigne(l)==BRANCHE)
                            ctx.drawImage(BRANCHE.imgGG,size*c,size*(WORLD.length-l-1),size,size);
                        
                        if (quelleObstacleAlaLigne(l)==FEU)
                            ctx.drawImage(FEU.imgGG,size*c,size*(WORLD.length-l-1),size,size);
                        }
                    else if (c == 5 && WORLD[l][4]!=EMPTY){
                        if (l+1<WORLD.length &&(WORLD[l+1][c]!=EMPTY))
                            ctx.drawImage(EMPTY.imgCG,size*c,size*(WORLD.length-l-1),size,size);
                        else
                            ctx.drawImage(EMPTY.imgD,size*c,size*(WORLD.length-l-1),size,size);
                        if (quelleObstacleAlaLigne(l)==BRANCHE)
                            ctx.drawImage(BRANCHE.imgDD,size*c,size*(WORLD.length-l-1),size,size);
                        
                        if (quelleObstacleAlaLigne(l)==FEU)
                            ctx.drawImage(FEU.imgDD,size*c,size*(WORLD.length-l-1),size,size);
                    } 
                    else if (c==2){
                        if ( l+1<WORLD.length && WORLD[l+1][c]!=EMPTY)   
                            ctx.drawImage(EMPTY.imgCD,size*c,size*(WORLD.length-l-1),size,size);
                        else if(WORLD[l][3]!=EMPTY)
                            ctx.drawImage(EMPTY.imgG,size*c,size*(WORLD.length-l-1),size,size);
                        else if (l>0 && WORLD[l-1][c]!=EMPTY)
                            ctx.drawImage(EMPTY.imgB,size*c,size*(WORLD.length-l-1),size,size);
                        else 
                            ctx.drawImage(EMPTY.img,size*c,size*(WORLD.length-l-1),size,size);
                    }
                    else if (c==4) {  
                        if (l+1<WORLD.length && WORLD[l+1][c]!=EMPTY)
                            ctx.drawImage(EMPTY.imgCG,size*c,size*(WORLD.length-l-1),size,size);
                        else if(WORLD[l][3]!=EMPTY)
                            ctx.drawImage(EMPTY.imgD,size*c,size*(WORLD.length-l-1),size,size);
                        else if (l>0 && WORLD[l-1][c]!=EMPTY)
                            ctx.drawImage(EMPTY.imgB,size*c,size*(WORLD.length-l-1),size,size);
                        else 
                            ctx.drawImage(EMPTY.img,size*c,size*(WORLD.length-l-1),size,size);
                    }
                    else if ((c==0 || c==6) && l+1<WORLD.length && WORLD[l+1][c]!=EMPTY){
                        ctx.drawImage(EMPTY.imgH,size*c,size*(WORLD.length-l-1),size,size);
                    }
                    else if (l>0 && WORLD[l-1][c]!=EMPTY)
                        ctx.drawImage(EMPTY.imgB,size*c,size*(WORLD.length-l-1),size,size);
                    else 
                        ctx.drawImage(EMPTY.img,size*c,size*(WORLD.length-l-1),size,size);
                    
                    break;
                   
                case ARBRE:
                case FEU:
                case BRANCHE:
                case TROU:
                    dessinerLepiege(c,l,cell);
                    break;
                case PLAYER:
                    obs = quelleObstacleAlaLigne(l);
                    if (obs==EMPTY){
                        if (WORLD[l+1][c]==ROAD)
                            obs = ROAD1;
                        else
                            obs = ROAD;
                    }
                    if (obs == ROAD || obs == ROAD1)
                        switch (c){
                            case 2:
                                ctx.drawImage(obs.imgG,size*c,size*(WORLD.length-l-1),size,size);
                                break;
                            case 3:
                                ctx.drawImage(obs.imgM,size*c,size*(WORLD.length-l-1),size,size);
                                break;
                            case 4:
                                ctx.drawImage(obs.imgD,size*c,size*(WORLD.length-l-1),size,size);
                                break;
                            default:
                                ctx.drawImage(obs.imgS,size*c,size*(WORLD.length-l-1),size,size);
                        }
                    else
                        dessinerLepiege(c,l,obs);
                    ctx.drawImage(PLAYER.img,size*c,size*(WORLD.length-l-1),size,size);
                    if (c==2 && l-1>=0 && quelleObstacleAlaLigne(l-1)==ARBRE)
                        ctx.drawImage(ARBRE.imgS,size*c,size*(WORLD.length-l-1),size,size)
                    break;
                default:
                    ctx.fillRect(size*c,size*(WORLD.length-l-1),size,size);                
            }
        }
    } 

    if(tutoriel){
        afficheAideTuto();
    }
    
}

/**
 * Cette fonction affiche un certain type de cellule (ARBRE,TROU,BRANCHE,FEU)
 * @param c index de la colonne 
 * @param l index de la ligne
 * @param cell ceux qu'on veut dessiner
 */
function dessinerLepiege(c,l,cell){
    if (c<2 || c>4)
        return ctx.drawImage(ROAD.imgS,size*c,size*(WORLD.length-l-1),size,size);
    if (l+2<WORLD.length)
        route = quelleObstacleAlaLigne(l+2);
    else 
        route = quelleObstacleAlaLigne(l-2);
    if (c == 2)
        ctx.drawImage(route.imgG,size*c,size*(WORLD.length-l-1),size,size);
    else if (c == 3)
        ctx.drawImage(route.imgM,size*c,size*(WORLD.length-l-1),size,size);
    else 
        ctx.drawImage(route.imgD,size*c,size*(WORLD.length-l-1),size,size);
    if (player .posY == l && player .posX == c && player .glisse>0 && (cell==ARBRE || cell==FEU)){
        ctx.drawImage(PLAYER.img,size*c,size*(WORLD.length-l-1),size,size);
    }
    if (c == 2)
        ctx.drawImage(cell.imgG,size*c,size*(WORLD.length-l-1),size,size);
    else if (c == 3)
        ctx.drawImage(cell.imgM,size*c,size*(WORLD.length-l-1),size,size);
    else 
        ctx.drawImage(cell.imgD,size*c,size*(WORLD.length-l-1),size,size);
    
}

/**
 * Affiche le gif d'instruction pour le tutoriel
 */
function afficheAideTuto(){
    let posY =1;
    obstacle = quelleObstacleAlaLigne(posY);
    while(posY < 9 && (obstacle == EMPTY || obstacle == ROAD1 || obstacle == ROAD)){
        posY+=1;
        obstacle = quelleObstacleAlaLigne(posY);
    }
    tab = imageTuto.src.split('/');
    source = tab[tab.length-2]+'/'+tab[tab.length-1];
    switch(obstacle){
        case FEU:
        case BRANCHE: 
        case TROU:
            imageTuto.style.display="block";
            if (source!=TutorielImages.imgSauter)
                imageTuto.src = TutorielImages.imgSauter;
            break;
        case ARBRE:
            imageTuto.style.display="block";
            if (source!=TutorielImages.imgGlisser)
                imageTuto.src = TutorielImages.imgGlisser;
            break; 
        case -1:
        case EMPTY:
        case ROAD:
            posY=0;
            while(posY<9 &&  WORLD[posY][6]!=ROAD && WORLD[posY][6]!= ROAD1  && WORLD[posY][0]!=ROAD && WORLD[posY][0]!= ROAD1){
                posY++;
            }
            if( posY<9){
                imageTuto.style.display="block";
                if (WORLD[posY][6]==ROAD || WORLD[posY][6]== ROAD1 ){
                    if (source!=TutorielImages.imgTournerD)
                        imageTuto.src = TutorielImages.imgTournerD;
                }else{
                    if (source!=TutorielImages.imgTournerG)
                        imageTuto.src = TutorielImages.imgTournerG;
                }
            }else
            {
                imageTuto.style.display="none";
            }
            break;
        default:
            imageTuto.style.display="none";
    }

}

/**
 * test si on peut aller a droite et si c'est le cas apelle la fonction faisant aller à droite
 */
function actionDroite(){
    console.log("Droite");
        if ((WORLD[player .posY][5] == ROAD || WORLD[player .posY][5] == ROAD1)&&run){  
            run=false;
            pause = 30 * difficulté.saut;
            setTimeout(allerAdroite,pause,0)
        
        }
    
}

/**
 * Fait aller le personnage à droite si le joueur arrive en bord du canvas
 * on appelle la fonction changeEnvironnement
 */
function allerAdroite(){
    if (player .posX == 6){
        changeEnvironnement();
        PLAYER.img = imagePlayer.img1;
        draw();
        run =true;
    }
    else{
        WORLD[player .posY][player .posX] = WORLD[player .posY][player .posX+1];
        player .posX+=1;
        WORLD[player .posY][player .posX] = PLAYER;
        if (PLAYER.img == imagePlayer.imgD1)
            PLAYER.img = imagePlayer.imgD2;
        else
            PLAYER.img = imagePlayer.imgD1;
        draw();
        pause = 30 * difficulté.saut;
        setTimeout(allerAdroite,pause);
    }
}

/**
 * permet de changer de voie du joueur vers la droite
 */
function basculerAdroite(){
    if (player .posX<4 && ( WORLD[player .posY][player .posX+1] == ROAD || WORLD[player .posY][player .posX+1] == ROAD1) && run){
        WORLD[player .posY][player .posX]=WORLD[player .posY][player .posX+1];
        player .posX+=1;
        WORLD[player .posY][player .posX]=PLAYER;
        draw();
    }
}

/**
 * permet de changer de voie du joueur vers la gauche
 */
function basculerAgauche(){
    if (player .posX>2 && (WORLD[player .posY][player .posX-1] == ROAD || WORLD[player .posY][player .posX-1] == ROAD1) && run){
        WORLD[player .posY][player .posX]=WORLD[player .posY][player .posX-1];
        player .posX-=1;
        WORLD[player .posY][player .posX]=PLAYER;
        draw();
    }
}

/**
 * Fait aller le personnage à gauche si le joueur arrive en bord du canvas
 * on appelle la fonction changeEnvironnement
 */
function actionGauche(){
    console.log("Gauche");
        if ((WORLD[player .posY][1] == ROAD || WORLD[player .posY][1] == ROAD1)&&run){
            run=false;
            pause = 30 * difficulté.saut;
            setTimeout(allerAgauche,pause,0)
        }
}

/**
 * test si on peut aller a gauche et si c'est le cas apelle la fonction faisant aller à droite
 */
function allerAgauche(){
    if (player .posX == 0){
        changeEnvironnement();
        PLAYER.img = imagePlayer.img1;
        draw();
        run =true;
    }
    else{
        WORLD[player .posY][player .posX] = WORLD[player .posY][player .posX-1];
        player .posX-=1;
        WORLD[player .posY][player .posX] = PLAYER;
        
        if (PLAYER.img == imagePlayer.imgG1)
            PLAYER.img = imagePlayer.imgG2;
        else
            PLAYER.img = imagePlayer.imgG1;
        draw();
        pause = 30 * difficulté.saut;
        setTimeout(allerAgauche,pause);
    }
}

/**
 * réinitialise toute les variables du jeu a 0
 */
function initJeu(){
    score = 0;
    WORLD = [
        [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD, PLAYER, ROAD, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
        [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY]
      ];
    draw();
    prochainPiege=0;
    stopRoute = -1;
    nextRoad = ROAD;
    difficulté = {
        saut: 20,
        tour:5,
        boucle:0
    }
    player  = {
        posX: 3,
        posY: 1,
        saut:0,
        glisse:0,
        direction:0
    };


}

/**
 * Fait sauter le joueur si il le peut
 */
function sauter(){
    console.log("Saut");
    if (player .saut<-1){
        player .glisse=-1;
        player .saut=2;
        PLAYER.img = imagePlayer.imgUp;
    }

}

/**
 * Fait glisser le joueur si il le peut
 */
function glisser(){
    console.log("Glisse");
    if (player .glisse<-1){
        player .saut=-1;
        player .glisse=2;
        PLAYER.img = imagePlayer.imgDown;
    }
}

/**
 * vérifie si le joueur est entré dans un obstacle ou si il est tombé dans le vide
 * Dans le cas ou le joueur s'est pris un obstacle, on change la variable sourceImageGameOver
 * avec l'url de l'image correspondant à l'obstacle.
 * @returns false s'il n'y a pas de colision true sinon
 */
function colision(){
    switch(WORLD[player .posY][player .posX]){
        case FEU : 
            if (player .saut >0 || player .glisse>0){
                return false;
            }else
            sourceImageGameOver = gameOverImage.imgFeu;
            return true
        case BRANCHE :  
            if ((player .saut >0)){
                    
                return false;
            }else{
                sourceImageGameOver = gameOverImage.imgBranche;
                return true;}
        case TROU :
            if ((player .saut >0)){
                return false;
            }else{
                sourceImageGameOver = gameOverImage.imgTrou;
                return true;}
        case ARBRE :
            if ((player .glisse >0)){
                return false;
            }else{
                sourceImageGameOver = gameOverImage.imgArbre;
                return true;
                }
        case EMPTY:
            sourceImageGameOver = gameOverImage.imgChute;
            return true;
        default:
            return false;
    }
         
}

/**
 * Appeler lorsqu'on tourne à droite ou à gauche, refait une route droite
 * et parfois change la couleur de l'eau (vert ou bleu)
 */
 function changeEnvironnement(){
    player .direction = 0;
    player .posX = 3;
    stopRoute = -1;
    player .posY= 1;
    if (Math.floor(Math.random()*100)%4==0){
        if (EMPTY.c == "#588157"){
            EMPTY.c = "#444b66";
            EMPTY.img = imagesEmpty2[0];
            EMPTY.imgG = imagesEmpty2[2];
            EMPTY.imgD = imagesEmpty2[1];
            EMPTY.imgCD = imagesEmpty2[3];
            EMPTY.imgCG = imagesEmpty2[4];
            EMPTY.imgB = imagesEmpty2[5];
            EMPTY.imgH = imagesEmpty2[6];
            TROU.imgD = imagesTrou.imgD1;
            TROU.imgM = imagesTrou.imgM1;
            TROU.imgG = imagesTrou.imgG1;
            }
        else {
            EMPTY.c = "#588157";
            EMPTY.img = imagesEmpty1[0];
            EMPTY.imgG = imagesEmpty1[2];
            EMPTY.imgD = imagesEmpty1[1];
            EMPTY.imgCD = imagesEmpty1[3];
            EMPTY.imgCG = imagesEmpty1[4];
            EMPTY.imgB = imagesEmpty1[5];
            EMPTY.imgH = imagesEmpty1[6];
            TROU.imgD = imagesTrou.imgD;
            TROU.imgM = imagesTrou.imgM;
            TROU.imgG = imagesTrou.imgG;}
    }
    WORLD = [
    [EMPTY, EMPTY, EMPTY, ROAD1, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, PLAYER, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, ROAD1, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, ROAD, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, ROAD1, EMPTY, EMPTY, EMPTY],
    creerLigne(),
    creerLigne(),
    creerLigne(),
    creerLigne(),
    creerLigne()];
}

/**
 *  Fonction de fin de jeu, clear l'interval et affiche l'écran de gameOver 
 */
function gameOver(){
    console.log("Game Over");
    console.log("Score : "+score);
    run = false;
    clearInterval(jeuID);
    let image = (document.querySelector("#gameOver img"));
    image.src = sourceImageGameOver;
    image.style.height = size*4  + 'px';
    image.style.width =size*6 + 'px';
    screenGameOver.style.display = 'block';
    (document.querySelector("#gameOver p")).textContent = "Score : "+score;
}

/**
 * Génére une route spécial avec le chemin qui par vers la droite
 * 
 * @param r soit ROAD ou ROAD1
 * @returns tableau pouvant être une ligne de WORLD
 */
function cheminADroite(r){
    return [EMPTY, EMPTY, r, r, r, r, r];
}

/**
 * Génére une route spécial avec le chemin qui par vers la gauche
 * 
 * @param r soit ROAD ou ROAD1
 * @returns tableau pouvant être une ligne de WORLD
 */
function cheminAGauche(r){
    
    return [r, r, r, r, r,EMPTY, EMPTY];
}

/**
 * Génére une route spécial avec le chemin qui par vers la droite et la gauche
 * 
 * @param r soit ROAD ou ROAD1
 * @returns tableau pouvant être une ligne de WORLD
 */
function cheminAGetD(r){
    
    return [r, r, r, r, r, r, r];
}


/**
 * Génere une nouvelle ligne pour le tableau WORLD 
 * aléatoirement avec un piege
 * 
 * @returns tableau pouvant être une ligne de WORLD
 */
function creerLigne(){
    if (nextRoad==ROAD1) r= ROAD;
    else r = ROAD1;
    nextRoad = r;
    var newLine;

    if (stopRoute==0){
        newLine = [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY];
    }
    else{
        newLine = [EMPTY,EMPTY,r,r,r,EMPTY,EMPTY];
        prochainPiege--;
        if ((Math.floor(Math.random()*100))%4==0 && prochainPiege<0){
            switch(Math.floor(Math.random()*100)%5){
                case 0:
                    newLine[2]=FEU;
                    newLine[3]=FEU;
                    newLine[4]=FEU;
                    break;
                case 1:
                    newLine[2]=ARBRE;
                    newLine[3]=ARBRE;
                    newLine[4]=ARBRE;
                    break;

                case 2:
                    newLine[2]=TROU;
                    newLine[3]=TROU;
                    newLine[4]=TROU;
                    break;
                case 3:
                    newLine[2]=BRANCHE;
                    newLine[3]=BRANCHE;
                    newLine[4]=BRANCHE;
                    break;
                case 4:
                    switch (Math.floor(Math.random()*100)%3){
                        case 0:
                            newLine = cheminAGauche(r);
                            break;
                        case 1:
                            newLine = cheminADroite(r);
                            break;
                        case 2:
                            newLine = cheminAGetD(r);
                            break;
                    }
                    stopRoute = 0;

            };
            prochainPiege = 1+Math.floor(difficulté.saut/5);
        }
        
    }
    return newLine;
}

/**
 * cet fonction vas décalé toute les lignes du tableau WORLD, pop une ligne
 * et en ajouter une nouvelle générer par la fonction 'créerLigne' ou en 
 * se servant des ligne prédéfinit du tutoriel
 * 
 * c'est ce qui vas faire l'inpression que le joueur avance
 */
function AjoutLigne(){
    if(tutoriel==true && stopRoute !=0){
        newLine = chemin.pop();

        if(newLine[6] == ROAD1 ||newLine[0] == ROAD ){
            prochainPiege=6;
            stopRoute = 0;
        }
        if(chemin.length == 0){
            tutoriel =false;
        }
    }
    else{
        newLine = creerLigne();
    }
    WORLD[player .posY][player .posX]=quelleObstacleAlaLigne(player .posY);
    if (WORLD[player .posY][player .posX] == EMPTY)
        WORLD[player .posY][player .posX]  = (nextRoad==ROAD)?ROAD:ROAD1;

    for (l=0;l<WORLD.length-1;l++){
            WORLD[l]=WORLD[l+1];
    }

    

    WORLD.pop();
    WORLD.push(newLine);
    if (colision()){
        draw();
        gameOver();
    }else{
        
        if (!((WORLD[player .posY][player .posX]==FEU && player .glisse>0) || WORLD[player .posY][player .posX]==ARBRE)){
            WORLD[player .posY][player .posX]=PLAYER;
            if (!(player .glisse>0 || player .saut>0))
                if (PLAYER.img == imagePlayer.img1)
                    PLAYER.img = imagePlayer.img2;
                else
                    PLAYER.img = imagePlayer.img1;
            
        }
        if (player .direction>0){
            actionGauche();
            player .direction--;}
        if (player .direction<0){
            actionDroite();
            player .direction++;}
        player .glisse--;
        player .saut--;

        draw();
    }
}






