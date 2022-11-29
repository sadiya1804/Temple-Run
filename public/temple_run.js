h = window.innerHeight -10;
w= window.innerWidth-10;
h=Math.floor(h/10);
w=Math.floor(w/7);
const SIZE = Math.min(h,w);
const bt = document.getElementsByTagName("button")[0];
const imagesEmpty1 = [createImg("images/empty1.png"),
createImg("images/emptyD.png"),
createImg("images/emptyG.png"),
createImg("images/emptyCoinHD.png"),
createImg("images/emptyCoinHG.png"),
createImg("images/emptyB.png"),
createImg("images/emptyH.png")];
const imagesEmpty2 = [createImg("images/empty2.png"),
createImg("images/empty2D.png"),
createImg("images/empty2G.png"),
createImg("images/empty2HD.png"),
createImg("images/empty2HG.png"),
createImg("images/empty2B.png"),
createImg("images/empty2H.png")];
var EMPTY = {c: "#588157",
n:"empty",
img:imagesEmpty1[0],
imgD:imagesEmpty1[1],
imgG:imagesEmpty1[2],
imgCD:imagesEmpty1[3],
imgCG:imagesEmpty1[4],
imgB:imagesEmpty1[5],
imgH:imagesEmpty1[6]
} ;
const ROAD = {c:"#895737",
    n:"road",
    imgD: createImg("images/S3.png"),
    imgM: createImg("images/S2.png"),
    imgG: createImg("images/S1.png"),
    imgS: createImg("images/S7.png")
};
const ROAD1 = {c:"#704b34",
    n:"road1",
    imgD: createImg("images/S6.png"),
    imgM: createImg("images/S5.png"),
    imgG: createImg("images/S4.png"),
    imgS: createImg("images/S7.png")
};
const PLAYER = {c:"#F77F00",n:'skin',
    img: createImg("images/p2.png")};

const imagePlayer = {
    img1:createImg("images/p1.png"),
    img2:createImg("images/p2.png"),
    imgD1:createImg("images/pD1.png"),
    imgD2:createImg("images/pD2.png"),
    imgG1:createImg("images/pG1.png"),
    imgG2:createImg("images/pG2.png"),
    imgUp:createImg("images/pUP.png"),
    imgDown:createImg("images/pDown.png"),
}

const FEU = {c:"#f74222",n:"feu",
    imgDD: createImg("images/Feu4.png"),
    imgD: createImg("images/Feu3.png"),
    imgM: createImg("images/Feu2.png"),
    imgG: createImg("images/Feu1.png"),
    imgGG: createImg("images/Feu0.png")
};
const BRANCHE = {c:"#605952",n:"branche",
    imgDD: createImg("images/branche5.png"),
    imgD: createImg("images/branche4.png"),
    imgM:createImg("images/branche3.png"),
    imgG:createImg("images/branche2.png"),
    imgGG:createImg("images/branche1.png")};
const imagesTrou = {imgD: createImg("images/trou3.png"),
    imgM: createImg("images/trou2.png"),
    imgG: createImg("images/trou1.png"),
    imgD1: createImg("images/2trou3.png"),
    imgM1: createImg("images/2trou2.png"),
    imgG1: createImg("images/2trou1.png")}

const TROU = {c:"#000000",n:"trou",
    imgD: imagesTrou.imgD,
    imgM: imagesTrou.imgM,
    imgG: imagesTrou.imgG,};

const ARBRE ={c:"#0008ff",n:"arbre",
imgD: createImg("images/arbre4.png"),
imgM: createImg("images/arbre3.png"),
imgG: createImg("images/arbre2.png"),
imgS: createImg("images/arbre1.png")
};


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

let posSkin = {
    x: 3,
    y: 1,
    saut:0,
    glisse:0,
    dir:0
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
            posSkin.dir = +2;
            actionGauche();
            basculerAgauche();
        }
        if (evt.key == 'ArrowRight'){
            posSkin.dir = -2;
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


/**  Cette fonction retourne un element HtMl avec pour source l'argument
 * 
 * @param 
*/
function createImg(source){
    let image = new Image();
    image.src = source;
    return image;
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
          posSkin.dir = -2;
          actionDroite();
        }
        else{
          console.log("glisse_Gauche");
          posSkin.dir = +2;
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
            posSkin.dir = -2;
            actionDroite();
          }
          else{
            console.log("glisse_Gauche");
            posSkin.dir = +2;
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
    bt.style.display ='none';
    initJeu();
    jeuID = setInterval(Jeu,30);
    run = true;

})


function quelleObstacleAlaLigne(y){    
    switch(posSkin.x){
        case 2:
        case 3:
            x=4;
            break;
        case 4:
            x=2;
            break;
        default:
            x=-1;
    }
    if (y<0||x<0||y>9)
        return -1;
    return WORLD[y][x];
}

function dessinerLepiege(c,l,cell){
    if (c<2 || c>4)
        return ctx.drawImage(ROAD.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    if (l+2<WORLD.length)
        route = quelleObstacleAlaLigne(l+2);
    else 
        route = quelleObstacleAlaLigne(l-2);
    console.log(route);
    if (c == 2)
        ctx.drawImage(route.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    else if (c == 3)
        ctx.drawImage(route.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    else 
        ctx.drawImage(route.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
    if (posSkin.y == l && posSkin.x == c && posSkin.glisse>0 && (cell==ARBRE || cell==FEU)){
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
    
}

function actionDroite(){
    console.log("Droite");
        if ((WORLD[posSkin.y][5] == ROAD || WORLD[posSkin.y][5] == ROAD1)&&run){  
            run=false;
            pause = 30 * difficulté.saut;
            setTimeout(allerAdroite,pause,0)
        
        }
    
}
    
function changeEnvironnement(){
    posSkin.dir = 0;
    posSkin.x = 3;
    stopRoute = -1;
    posSkin.y= 1;
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
    if (posSkin.x == 6){
        changeEnvironnement();
        PLAYER.img = imagePlayer.img1;
        draw();
        run =true;
    }
    else{
        WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x+1];
        posSkin.x+=1;
        WORLD[posSkin.y][posSkin.x] = PLAYER;
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
    if (posSkin.x<4 && ( WORLD[posSkin.y][posSkin.x+1] == ROAD || WORLD[posSkin.y][posSkin.x+1] == ROAD1) && run){
        WORLD[posSkin.y][posSkin.x]=WORLD[posSkin.y][posSkin.x+1];
        posSkin.x+=1;
        WORLD[posSkin.y][posSkin.x]=PLAYER;
        draw();
    }
}

function basculerAgauche(){
    if (posSkin.x>2 && (WORLD[posSkin.y][posSkin.x-1] == ROAD || WORLD[posSkin.y][posSkin.x-1] == ROAD1) && run){
        WORLD[posSkin.y][posSkin.x]=WORLD[posSkin.y][posSkin.x-1];
        posSkin.x-=1;
        WORLD[posSkin.y][posSkin.x]=PLAYER;
        draw();
    }
}

function actionGauche(){
    console.log("Gauche");
        if ((WORLD[posSkin.y][1] == ROAD || WORLD[posSkin.y][1] == ROAD1)&&run){
            run=false;
            pause = 30 * difficulté.saut;
            setTimeout(allerAgauche,pause,0)
        }
}
function allerAgauche(){
    if (posSkin.x == 0){
        changeEnvironnement();
        PLAYER.img = imagePlayer.img1;
        draw();
        run =true;
    }
    else{
        WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x-1];
        posSkin.x-=1;
        WORLD[posSkin.y][posSkin.x] = PLAYER;
        
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
    posSkin = {
        x: 3,
        y: 1,
        saut:0,
        glisse:0,
        dir:0
    };


}

function sauter(){
    console.log("Saut");
    if (posSkin.saut<-1){
        posSkin.glisse=-1;
        posSkin.saut=2;
        PLAYER.img = imagePlayer.imgUp;
    }

}

function glisser(){
    console.log("Glisse");
    if (posSkin.glisse<-1){
        posSkin.saut=-1;
        posSkin.glisse=2;
        PLAYER.img = imagePlayer.imgDown;
    }
}

function colision(){
    switch(WORLD[posSkin.y][posSkin.x]){
        case FEU : 
            if (posSkin.saut >0 || posSkin.glisse>0){
                return false;
            }else
            return true
        case BRANCHE :
        case TROU :
            if ((posSkin.saut >0)){
                return false;
            }else
                return true;
        case ARBRE :
            if ((posSkin.glisse >0)){
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
    bt.style.display = 'block';
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
    newLine = creerLigne();

    WORLD[posSkin.y][posSkin.x]=quelleObstacleAlaLigne(posSkin.y);
    if (WORLD[posSkin.y][posSkin.x]==EMPTY)
        WORLD[posSkin.y][posSkin.x]=(nextRoad==ROAD)? ROAD1:ROAD;

    for (l=0;l<WORLD.length-1;l++){
            WORLD[l]=WORLD[l+1];
    }

    

    WORLD.pop();
    WORLD.push(newLine);
    if (colision()){
        draw();
        gameOver();
    }else{
        
        if (!((WORLD[posSkin.y][posSkin.x]==FEU && posSkin.glisse>0) || WORLD[posSkin.y][posSkin.x]==ARBRE)){
            WORLD[posSkin.y][posSkin.x]=PLAYER;
            if (!(posSkin.glisse>0 || posSkin.saut>0))
                if (PLAYER.img == imagePlayer.img1)
                    PLAYER.img = imagePlayer.img2;
                else
                    PLAYER.img = imagePlayer.img1;
            
        }
        if (posSkin.dir>0){
            actionGauche();
            posSkin.dir--;}
        if (posSkin.dir<0){
            actionDroite();
            posSkin.dir++;}
        posSkin.glisse--;
        posSkin.saut--;

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




