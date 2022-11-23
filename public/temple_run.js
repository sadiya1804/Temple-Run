h = window.innerHeight -10;
w= window.innerWidth-10;
h=Math.floor(h/10);
w=Math.floor(w/7);
const SIZE = Math.min(h,w);
const bt = document.getElementsByTagName("button")[0];
img_M  = new Image();
img_M.src = "images/empty1.png";
img_D  = new Image();
img_D.src = "images/emptyD.png";
img_G  = new Image();
img_G.src = "images/emptyG.png";
var EMPTY = {c: "#588157",

img:img_M,
imgD:img_D,
imgG:img_G} ;

img_D  = new Image()
img_D.src = "images/S3.png"
img_M  = new Image()
img_M.src = "images/S2.png"
img_G  = new Image()
img_G.src = "images/S1.png"
img_s  = new Image()
img_s.src = "images/S7.png"
var ROAD = {c:"#895737",
    imgD: img_D,
    imgM: img_M,
    imgG: img_G,
    imgS: img_s
};
img_D  = new Image()
img_D.src = "images/S6.png"
img_M  = new Image()
img_M.src = "images/S5.png"
img_G  = new Image()
img_G.src = "images/S4.png"
const ROAD1 = {c:"#704b34",
    imgD: img_D,
    imgM: img_M,
    imgG: img_G,
    imgS: img_s
};
const SKIN = "#F77F00";
const SKINUP = "#eac39d";
const SKINDOWN = "#775839";
img_D  = new Image()
img_D.src = "images/Feu3.png"
img_M  = new Image()
img_M.src = "images/Feu2.png"
img_G  = new Image()
img_G.src = "images/Feu1.png"
const FEU = {c:"#f74222",
    imgD: img_D,
    imgM: img_M,
    imgG: img_G
};
const BRANCHE = "#605952";
const TROU = "#000000";
const ARBRE ="#0008ff";

let img = new Image();
img.src = "images/p1.png";


var canvas = document.getElementById('zoneJeu');
var run = false;
var ctx = canvas.getContext('2d');
var prochainPiege=0;
var nextRoad = ROAD;

var stopRoute = -1;
var difficulté = {
    saut: 20,
    tour:5,
    boucle:0
}


ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";

var posSkin = {
    x: 3,
    y: 1,
    saut:0,
    glisse:0,
    dir:0
};

let WORLD = [
    [EMPTY, EMPTY, ROAD1, ROAD1, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, SKIN, ROAD, EMPTY, EMPTY],
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
            allerAGauche();
        }
        if (evt.key == 'ArrowRight'){
            posSkin.dir = -2;
            allerADroite();
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
          allerADroite();
        }
        else{
          console.log("glisse_Gauche");
          posSkin.dir = +2;
          allerAGauche();
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
            allerADroite();
          }
          else{
            console.log("glisse_Gauche");
            posSkin.dir = +2;
            allerAGauche();
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
    run = true;

})

function draw(){
    var l = 0;
    var c =0;

    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (l=0;l<WORLD.length;l++){
        for (c=0;c<WORLD[l].length;c++){
            cell = WORLD[l][c];
            ctx.fillStyle = cell;
            switch(cell){
                case SKIN:
                    ctx.drawImage(img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    break;
                case ROAD:
                    if (c == 2)
                        ctx.drawImage(ROAD.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 4)
                        ctx.drawImage(ROAD.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 3)
                        ctx.drawImage(ROAD.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else 
                        ctx.drawImage(ROAD.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    break;
                case ROAD1:
                    if (c == 2)
                        ctx.drawImage(ROAD1.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 4)
                        ctx.drawImage(ROAD1.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 3)
                        ctx.drawImage(ROAD1.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else 
                        ctx.drawImage(ROAD.imgS,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    break;
                case FEU:
                    if (c == 2)
                        ctx.drawImage(FEU.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 4)
                        ctx.drawImage(FEU.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else 
                        ctx.drawImage(FEU.imgM,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    break;
                case EMPTY:
                    if (c == 1)
                        ctx.drawImage(EMPTY.imgG,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else if (c == 5)
                        ctx.drawImage(EMPTY.imgD,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    else 
                        ctx.drawImage(EMPTY.img,SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
                    break;
                default:
                    ctx.fillRect(SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
            }
        }
    }
    
    
    
}

function allerADroite(){
    console.log("Droite");
        if ((WORLD[posSkin.y][posSkin.x+2] == ROAD || WORLD[posSkin.y][posSkin.x+2] == ROAD1)&&run){  
            run=false;
            setTimeout(goDroite,difficulté.saut*10+300,0)
        
        }
    
}
    
function changeEnvironnement(){
    posSkin.dir = 0;
    posSkin.x = 3;
    stopRoute = -1;
    posSkin.y= 1;
    if (EMPTY.c == "#588157")
        EMPTY.c = "#444b66";
    else EMPTY.c = "#588157";
    WORLD = [
    [EMPTY, EMPTY, EMPTY, ROAD1, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, SKIN, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, ROAD1, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, ROAD, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, ROAD1, EMPTY, EMPTY, EMPTY],
    creerLigne(),
    creerLigne(),
    creerLigne(),
    creerLigne(),
    creerLigne()];
}


function goDroite(x){
    console.log(x);
    if (x == 3){
        changeEnvironnement();
        draw();
        run =true;
    }
    else{
        WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x+1];
        posSkin.x+=1;
        WORLD[posSkin.y][posSkin.x] = SKIN;
        draw();
        setTimeout(goDroite,difficulté.saut*10+300,++x);
    }
}

function allerAGauche(){
    console.log("Gauche");
        if ((WORLD[posSkin.y][posSkin.x-2] == ROAD || WORLD[posSkin.y][posSkin.x-2] == ROAD1)&&run){
            run=false;
            setTimeout(goGauche,difficulté.saut*10+300,0)
            
        }
}
function goGauche(x){
    console.log(x)
    if (x ==3){
        changeEnvironnement();
        draw();
        run =true;
    }
    else{
        WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x-1];
        posSkin.x-=1;
        WORLD[posSkin.y][posSkin.x] = SKIN;
        draw();
        setTimeout(goGauche,difficulté.saut*10+300,++x);
    }
}



function sauter(){
    console.log("Saut");
    if (posSkin.saut<-1){
        posSkin.glisse=-1;
        posSkin.saut=2;
        WORLD[posSkin.y][posSkin.x]=SKINUP
    }

}

function glisser(){
    console.log("Glisse");
    if (posSkin.glisse<-1){
        posSkin.saut=-1;
        posSkin.glisse=2;
        WORLD[posSkin.y][posSkin.x]=SKINDOWN
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
    run = false;
    alert("Game Over");
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
    else if (stopRoute>0){
        newLine = [EMPTY,EMPTY,EMPTY,r,EMPTY,EMPTY,EMPTY];
        stopRoute--;
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
                    stopRoute = Math.floor((Math.random()*100))%6;

            };
            prochainPiege = 1+Math.floor(difficulté.saut/5);
        }
        
    }
    return newLine;
}

function AjoutLigne(){
    newLine = creerLigne();

    WORLD[posSkin.y][posSkin.x]=WORLD[posSkin.y][posSkin.x-1];
    if (WORLD[posSkin.y][posSkin.x] == EMPTY)
        WORLD[posSkin.y][posSkin.x]  = ROAD;

    for (l=0;l<WORLD.length-1;l++){
            WORLD[l]=WORLD[l+1];
    }

    

    WORLD.pop();
    WORLD.push(newLine);
    if (colision()){
        gameOver();
        draw();
    }else{
    
        if (posSkin.glisse>0){
            if (!(WORLD[posSkin.y][posSkin.x]==FEU || WORLD[posSkin.y][posSkin.x]==ARBRE))
                WORLD[posSkin.y][posSkin.x]=SKINDOWN;
        }
        else if (posSkin.saut>0){
            WORLD[posSkin.y][posSkin.x]=SKINUP;
        }
        else{
            WORLD[posSkin.y][posSkin.x]=SKIN;
        }

        
        if (posSkin.dir>0){
            allerAGauche();
            posSkin.dir--;}
        if (posSkin.dir<0){
            allerADroite();
            posSkin.dir++;}
        posSkin.glisse--;
        posSkin.saut--;

        draw();
    }
}

(function () {
    console.log("👋");
    function Jeu(){
        if (run){
                difficulté.boucle++;
                if (difficulté.boucle%difficulté.saut == 0){
                    difficulté.tour--;
                    AjoutLigne();
                    
                    if (difficulté.tour==0){
                        difficulté.saut--;
                        difficulté.tour=10 * (20- difficulté.saut)
                    }
                }
            
        }
    }
    setInterval(Jeu,30);
})();



