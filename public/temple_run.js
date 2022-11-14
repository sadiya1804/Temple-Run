const SIZE = 50;
const EMPTY = "#588157";
const ROAD = "#895737";
const ROAD1 = "#704b34";
const SKIN = "#F77F00";
const PIEGE = "#f74222"

var canvas = document.getElementById('zoneJeu');

var ctx = canvas.getContext('2d');


ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";

var posSkin = {
    x: 3,
    y: 0
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
    if (evt.key == 'ArrowLeft'){
        if (WORLD[posSkin.y][posSkin.x-1]==ROAD || WORLD[posSkin.y][posSkin.x-1]==ROAD1 ){
            WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x-1];
            posSkin.x-=1;
            WORLD[posSkin.y][posSkin.x] = SKIN;
            draw();
        }
    }
    if (evt.key == 'ArrowRight'){
        if (WORLD[posSkin.y][posSkin.x+1] == ROAD || WORLD[posSkin.y][posSkin.x+1] == ROAD1){
            WORLD[posSkin.y][posSkin.x] = WORLD[posSkin.y][posSkin.x+1];
            posSkin.x+=1;
            WORLD[posSkin.y][posSkin.x] = SKIN;
            draw();
        }
    }
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

(function () {
    console.log("👋");
    function AjoutLigne(){
        if (WORLD[0][3] == ROAD || WORLD[0][2] == ROAD || WORLD[0][4] == ROAD) r= ROAD;
        else r = ROAD1;
    
        
    
        var newLine = [EMPTY,EMPTY,r,r,r,EMPTY,EMPTY];
        if ((Math.floor(Math.random()*100))%3==0){
            i = 1+Math.floor(Math.random()*100)%3;
            newLine[1+i]=PIEGE;
        }

        

        for (l=0;l<WORLD.length-1;l++){
                WORLD[l]=WORLD[l+1];
        }
        WORLD.pop();
        WORLD.push(newLine);
        if (WORLD[posSkin.y][posSkin.x]==PIEGE) {
            console.log("Boum");
            alert("GameOver");

        }
        WORLD[posSkin.y][posSkin.x]=SKIN;
    
        draw();
            
    }
    setInterval(AjoutLigne,200);
})();



