const SIZE = 50;
const EMPTY = "#588157";
const ROAD = "#895737";
const ROAD1 = "#704b34";
const SKIN = "#F77F00";
const SKINUP = "#eac39d";
const SKINDOWN = "#775839";
const FEU = "#f74222";
const BRANCHE = "#605952";
const TROU = "#000000";
const ARBRE ="#0008ff";


var canvas = document.getElementById('zoneJeu');
var run = true;
var ctx = canvas.getContext('2d');
var prochainPiege=0;
var nextRoad = ROAD;
var difficulté = {
    saut: 20,
    tour:0,
    boucle:0
}

ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";

var posSkin = {
    x: 3,
    y: 0,
    saut:0,
    glisse:0
};

let WORLD = [
    [EMPTY, EMPTY, ROAD1, SKIN, ROAD1, EMPTY, EMPTY],
    [EMPTY, EMPTY, ROAD, ROAD, ROAD, EMPTY, EMPTY],
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
            allerAGauche();
        }
        if (evt.key == 'ArrowRight'){
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


function draw(){
    var l = 0;
    var c =0;

    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (l=0;l<WORLD.length;l++){
        for (c=0;c<WORLD[l].length;c++){
            cell = WORLD[l][c];
            ctx.fillStyle = cell;
            ctx.fillRect(SIZE*c,SIZE*(WORLD.length-l-1),SIZE,SIZE);
            
        }
    }
    
    
    
}

function allerADroite(){
    console.log("Droite");
    if (WORLD[posSkin.y][posSkin.x+2] == ROAD || WORLD[posSkin.y][posSkin.x+2] == ROAD1){
        WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x+2];
        posSkin.x+=2;
        WORLD[posSkin.y][posSkin.x] = SKIN;
    }
    
}

function allerAGauche(){
    console.log("Gauche");
    if (WORLD[posSkin.y][posSkin.x-2] == ROAD || WORLD[posSkin.y][posSkin.x-2] == ROAD1){
        WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x-2];
        posSkin.x-=2;
        WORLD[posSkin.y][posSkin.x] = SKIN;
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
            
        default:
            return false;
    }
         
}

function gameOver(){
    console.log("Game Over");
    jeu = false;
}
function AjoutLigne(){
    if (nextRoad==ROAD1) r= ROAD;
    else r = ROAD1;
    nextRoad = r;
    

    var newLine = [EMPTY,EMPTY,r,r,r,EMPTY,EMPTY];
    prochainPiege--;
    if ((Math.floor(Math.random()*100))%4==0 && prochainPiege<0){
        switch(Math.floor(Math.random()*100)%4){
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
        };
        prochainPiege = 5;
    }

    

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
            WORLD[posSkin.y][posSkin.x]=SKINDOWN;
        }
        else if (posSkin.saut>0){
            WORLD[posSkin.y][posSkin.x]=SKINUP;
        }
        else{
            WORLD[posSkin.y][posSkin.x]=SKIN;
        }

        

        posSkin.glisse--;
        posSkin.saut--;

        draw();
    }
}

(function () {
    console.log("👋");
    function Jeu(){
        if (jeu)
            difficulté.boucle++;
            if (difficulté.boucle%difficulté.saut==0){
                difficulté.tour++;
                AjoutLigne();
                difficulté.saut = 20-Math.floor(difficulté.tour/100)
            }
    }
    setInterval(Jeu,30);
})();



