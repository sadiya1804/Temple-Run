var canvas = document.getElementById('zoneJeu');
var ctx = canvas.getContext('2d');

ctx.strokeStyle = "red";
ctx.fillStyle = "#00FF00";
let xG= Math.floor(canvas.width-10 * Math.random());
let mouvxG=(-1*(Math.floor(2 * Math.random())))* (Math.floor(4 * Math.random()));
let yG=Math.floor(canvas.height-10 * Math.random());
let mouvyG=(-1*(Math.floor(2 * Math.random())))*( Math.floor(4 * Math.random()));
let xB= Math.floor(canvas.width-10 * Math.random());
let mouvxB=(-1*(Math.floor(2 * Math.random())))*(2 + Math.floor(4 * Math.random()));
let yB= Math.floor(canvas.height-10 * Math.random());
let mouvyB=(-1*(Math.floor(2 * Math.random())))*(2 + Math.floor(4 * Math.random()));


(function () {
    console.log("👋");
    function draw(){
        if (xG <= 0){
            mouvxG = Math.floor(4 * Math.random());
        }
        if (xG >= canvas.width-10){
            mouvxG = - Math.floor(4 * Math.random());
        }
        if (yG <=0){
            mouvyG = Math.floor(4 * Math.random());
        }
        if (yG >=canvas.height-10){
            mouvyG = - Math.floor(4 * Math.random());
        }
        if (xB <= 0){
            mouvxB = 2 + Math.floor(4 * Math.random());
        }
        if (xB >= canvas.width-10){
            mouvxB = - 2 -Math.floor(4 * Math.random());
        }
        if (yB <=0){
            mouvyB = 2+Math.floor(4 * Math.random());
        }
        if (yB >=canvas.height-20){
            mouvyB = -2 - Math.floor(4 * Math.random());
        }
        
        xG=xG+mouvxG;
        yG=yG+mouvyG;
        xB=xB+mouvxB;
        yB=yB+mouvyB;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(xG, yG,
                    10, 10);
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(xB, yB,
            10, 10);
                    
    
    }
    setInterval(draw,10);
})();
        