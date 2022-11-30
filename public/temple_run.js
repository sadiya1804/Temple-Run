h = window.innerHeight -10;
w= window.innerWidth-10;
h=Math.floor(h/10);
w=Math.floor(w/7);
// On définit la taille de la des cases du Cannevas en fonction de la taille de la fenêtre
const SIZE = Math.min(h,w);
// On récupère le bouton qui permet de lancer le jeu
const bt = document.getElementById('button1');


let jeuID;

let canvas = document.getElementById('zoneJeu');
let run = false;
let ctx = canvas.getContext('2d');
let prochainPiege=0;
let nextRoad = ROAD;

let stopRoute = -1;
let difficulté = {
    saut: 20,
    tour:5,
    boucle:0
}


ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";

let player  = {
    posX: 3,
    posY: 1,
    saut:0,
    glisse:0,
    direction:0
};
let score = 0;

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

canvas.height = WORLD.length*SIZE;
canvas.width = WORLD[0].length*SIZE;

document.addEventListener('keydown', function(evt){
    if (run){
        evt.preventDefault();
        if (evt.key == 'ArrowLeft'){
            player .direction = +2;
            actionGauche();
            basculerAgauche();
        }
        if (evt.key == 'ArrowRight'){
            player .direction = -2;
            actionDroite();
            basculerAdroite();
        }
        if (evt.key == 'ArrowUp' || evt.key == ' '){
            sauter();
        }
        if (evt.key == 'ArrowDown'){
            glisser();
        }
        draw();
    }
    evt.d
    //console.log(evt.key );
});




//partie tutoriel
var tutoriel = confirm("Voulez-vous suivre le turoriel ?");
var chemin = [ 
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    cheminAGauche(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    cheminADroite(ROAD1),  
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(BRANCHE),
    creerLigne2(ROAD1),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ARBRE),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(FEU),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(ROAD1),
    creerLigne2(ROAD),
    creerLigne2(TROU),

];
function creerLigne2(obstacle){
    return [EMPTY,EMPTY,obstacle,obstacle,obstacle, EMPTY, EMPTY];
}

 


/**{ DeBut Tactil event test*/
console.log("Tactil actif");
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchend', handleEnd);
canvas.addEventListener('touchcancel', handleCancel);
canvas.addEventListener('touchmove', handleMoove);

let ongoingTouche = null;

function handleStart(evt) {
    evt.preventDefault();
    console.log('touchstart.');
    const touches = evt.changedTouches;
    if (ongoingTouche == null){
        ongoingTouche = copyTouch(touches[0]);
    }
  }

function handleEnd(evt) {
  evt.preventDefault();
  console.log('touchEnd.');

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

function handleMoove(evt) {
    evt.preventDefault();
    console.log('touchEnd.');
  
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
  console.log('touchcancel.');

  const touches = evt.changedTouches;
    
  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      ongoingTouche=null;
    }
  }
}

function ongoingTouchIndexById(idToFind) {
  if (ongoingTouche.identifier == idToFind) {
    return ongoingTouche.identifier;
  }
  return -1;  
}

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}
/**}*/
bt.addEventListener('click',function(evt){
    var largeurWin = window.innerWidth;
    var hauteurWin = window.innerHeight;
    if (hauteurWin<canvas.height){
        canvas.style.bottom = '0px';
    }else
        canvas.style.bottom = Math.floor((hauteurWin-canvas.height)/2) + 'px';
    
    canvas.style.left = Math.floor((largeurWin-canvas.width)/2) + 'px';
    canvas.style.position = 'fixed';
    canvas.style.display = 'block';
    initJeu();
    jeuID = setInterval(Jeu,30);
    run = true;

})


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

function dessinerLepiege(c,l,cell){
    if (c<2 || c>4)
        return ctx.drawImage(ROAD.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    if (l+2<WORLD.length)
        route = quelleObstacleAlaLigne(l+2);
    else 
        route = quelleObstacleAlaLigne(l-2);
    if (c == 2)
        ctx.drawImage(route.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    else if (c == 3)
        ctx.drawImage(route.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    else 
        ctx.drawImage(route.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    if (player .posY == l && player .posX == c && player .glisse>0 && (cell==ARBRE || cell==FEU)){
        ctx.drawImage(PLAYER.img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    }
    if (c == 2)
        ctx.drawImage(cell.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    else if (c == 3)
        ctx.drawImage(cell.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    else 
        ctx.drawImage(cell.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    
}


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
                        ctx.drawImage(cell.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        if (quelleObstacleAlaLigne(l-1)==ARBRE){
                            ctx.drawImage(ARBRE.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);}}
                    else if (c == 4)
                        ctx.drawImage(cell.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 3)
                        ctx.drawImage(cell.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else 
                        ctx.drawImage(cell.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    break;

                case EMPTY:
                    if (c == 1 && WORLD[l][2]!=EMPTY){
                        
                        if (l+1<WORLD.length &&(WORLD[l+1][c] !=EMPTY))
                            ctx.drawImage(EMPTY.imgCD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else
                            ctx.drawImage(EMPTY.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        

                        if (quelleObstacleAlaLigne(l)==BRANCHE)
                            ctx.drawImage(BRANCHE.imgGG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        
                        if (quelleObstacleAlaLigne(l)==FEU)
                            ctx.drawImage(FEU.imgGG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        }
                    else if (c == 5 && WORLD[l][4]!=EMPTY){
                        if (l+1<WORLD.length &&(WORLD[l+1][c]!=EMPTY))
                            ctx.drawImage(EMPTY.imgCG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else
                            ctx.drawImage(EMPTY.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        if (quelleObstacleAlaLigne(l)==BRANCHE)
                            ctx.drawImage(BRANCHE.imgDD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        
                        if (quelleObstacleAlaLigne(l)==FEU)
                            ctx.drawImage(FEU.imgDD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    } 
                    else if (c==2){
                        if ( l+1<WORLD.length && WORLD[l+1][c]!=EMPTY)   
                            ctx.drawImage(EMPTY.imgCD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else if(WORLD[l][3]!=EMPTY)
                            ctx.drawImage(EMPTY.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else if (l>0 && WORLD[l-1][c]!=EMPTY)
                            ctx.drawImage(EMPTY.imgB,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else 
                            ctx.drawImage(EMPTY.img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    }
                    else if (c==4) {  
                        if (l+1<WORLD.length && WORLD[l+1][c]!=EMPTY)
                            ctx.drawImage(EMPTY.imgCG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else if(WORLD[l][3]!=EMPTY)
                            ctx.drawImage(EMPTY.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else if (l>0 && WORLD[l-1][c]!=EMPTY)
                            ctx.drawImage(EMPTY.imgB,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        else 
                            ctx.drawImage(EMPTY.img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    }
                    else if ((c==0 || c==6) && l+1<WORLD.length && WORLD[l+1][c]!=EMPTY){
                        ctx.drawImage(EMPTY.imgH,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    }
                    else if (l>0 && WORLD[l-1][c]!=EMPTY)
                        ctx.drawImage(EMPTY.imgB,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else 
                        ctx.drawImage(EMPTY.img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    
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
                                ctx.drawImage(obs.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                                break;
                            case 3:
                                ctx.drawImage(obs.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                                break;
                            case 4:
                                ctx.drawImage(obs.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                                break;
                            default:
                                ctx.drawImage(obs.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                        }
                    else
                        dessinerLepiege(c,l,obs);
                    ctx.drawImage(PLAYER.img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    if (c==2 && l-1>=0 && quelleObstacleAlaLigne(l-1)==ARBRE)
                        ctx.drawImage(ARBRE.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE)
                    break;
                default:
                    ctx.fillRect(SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);                
            }
        }
    } 

    if(tutoriel){
        afficheAideTuto();
    }
    
}

function afficheAideTuto(){
    let posY =1;
    obstacle = quelleObstacleAlaLigne(posY);
    while(posY < 9 && (obstacle == EMPTY || obstacle == ROAD1 || obstacle == ROAD)){
        posY+=1;
        obstacle = quelleObstacleAlaLigne(posY);
    }
    switch(obstacle){
        case FEU:
        case BRANCHE: 
        case TROU:
            ctx.drawImage(TutorielImages.imgSauter, 0,0,SIZE*7,Math.floor(((SIZE*7)/312)*130));
            break;
        case ARBRE:
            ctx.drawImage(TutorielImages.imgGlisser, 0,0,SIZE*7,Math.floor(((SIZE*7)/312)*130));
            break; 
        case -1:
        case EMPTY:
        case ROAD:
            console.log("vide");
            posY=0;
            while(posY<9 &&  WORLD[posY][6]!=ROAD && WORLD[posY][6]!= ROAD1  && WORLD[posY][0]!=ROAD && WORLD[posY][0]!= ROAD1){
                posY++;
            }
            if( posY<9){
                if (WORLD[posY][6]==ROAD || WORLD[posY][6]== ROAD1 )
                    ctx.drawImage(TutorielImages.imgTournerD, 0, 0,SIZE*7,Math.floor(((SIZE*7)/312)*130));
                else
                    ctx.drawImage(TutorielImages.imgTournerG, 0, 0,SIZE*7,Math.floor(((SIZE*7)/312)*130));
            }
            break;   
    }

}

function actionDroite(){
    console.log("Droite");
        if ((WORLD[player .posY][5] == ROAD || WORLD[player .posY][5] == ROAD1)&&run){  
            run=false;
            pause = 30 * difficulté.saut;
            setTimeout(allerAdroite,pause,0)
        
        }
    
}

    
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


function basculerAdroite(){
    if (player .posX<4 && ( WORLD[player .posY][player .posX+1] == ROAD || WORLD[player .posY][player .posX+1] == ROAD1) && run){
        WORLD[player .posY][player .posX]=WORLD[player .posY][player .posX+1];
        player .posX+=1;
        WORLD[player .posY][player .posX]=PLAYER;
        draw();
    }
}

function basculerAgauche(){
    if (player .posX>2 && (WORLD[player .posY][player .posX-1] == ROAD || WORLD[player .posY][player .posX-1] == ROAD1) && run){
        WORLD[player .posY][player .posX]=WORLD[player .posY][player .posX-1];
        player .posX-=1;
        WORLD[player .posY][player .posX]=PLAYER;
        draw();
    }
}

function actionGauche(){
    console.log("Gauche");
        if ((WORLD[player .posY][1] == ROAD || WORLD[player .posY][1] == ROAD1)&&run){
            run=false;
            pause = 30 * difficulté.saut;
            setTimeout(allerAgauche,pause,0)
        }
}
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

function sauter(){
    console.log("Saut");
    if (player .saut<-1){
        player .glisse=-1;
        player .saut=2;
        PLAYER.img = imagePlayer.imgUp;
    }

}

function glisser(){
    console.log("Glisse");
    if (player .glisse<-1){
        player .saut=-1;
        player .glisse=2;
        PLAYER.img = imagePlayer.imgDown;
    }
}

function colision(){
    switch(WORLD[player .posY][player .posX]){
        case FEU : 
            if (player .saut >0 || player .glisse>0){
                return false;
            }else
            return true
        case BRANCHE :
        case TROU :
            if ((player .saut >0)){
                return false;
            }else
                return true;
        case ARBRE :
            if ((player .glisse >0)){
                return false;
            }else
                return true
            
        case EMPTY:
            return true;
        default:
            return false;
    }
         
}

function gameOver(){
    console.log("Game Over");
    console.log("Score : "+score);
    run = false;
    alert("Game Over - Score : "+score);
    clearInterval(jeuID);
    canvas.style.display = 'none';
}

function cheminADroite(r){
    return [EMPTY, EMPTY, r, r, r, r, r];
}

function cheminAGauche(r){
    
    return [r, r, r, r, r,EMPTY, EMPTY];
}

function cheminAGetD(r){
    
    return [r, r, r, r, r, r, r];
}



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




