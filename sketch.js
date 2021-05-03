var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex,trex_running,trex_collided;
var ground,inVisibleGround,groundImage;
var cloudsGroup,cloudImage;
var obstaclesGroup,obtacles1,obtacles2,obtacles3,obtacles4,obtacles5,obtacles6;
var score = 0;
var gameOver,reStart;
var canvas;

function preload(){
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    obtacles1 = loadImage("obstacle1.png");
    obtacles2 = loadImage("obstacle2.png");
    obtacles3 = loadImage("obstacle3.png");
    obtacles4 = loadImage("obstacle4.png");
    obtacles5 = loadImage("obstacle5.png");
    obtacles6 = loadImage("obstacle6.png");
    gameOver = loadImage("gameOver.png");
    reStartimg = loadImage("restart.png");
   jumpSound = loadSound("jump.mp3");
   dieSound = loadSound("die.mp3");
   checkPointSound = loadSound("checkPoint.mp3");
}

function setup(){
    canvas= createCanvas(600,200);
    trex = createSprite(50,180,20,50);
    trex.addAnimation("running",trex_running);
    trex.addAnimation("collided",trex_collided);
    trex.scale = 0.5;

    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);

    ground.x = ground.width/2;
    ground.velocityX = -(6+3*score/100);

    gameOve = createSprite(300,100);
    gameOve.addImage(gameOver);

    reStart = createSprite(300,50);
    reStart.addImage(reStartimg);

    gameOve.scale = 0.5;
    reStart.scale = 0.5;

    gameOve.visible = false;
    reStart.visible = false;

    inVisibleGround = createSprite(200,190,400,10);
    inVisibleGround.visible = false;
    
    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;

}

function draw(){
    background(255);
    text("score"+ score,500,50);
    if(gameState === PLAY){
        score = score + Math.round(getFrameRate()/60);
        if(keyDown("space") && trex.y>= 159){
            jumpSound.play();
            trex.velocityY = -10;
        }
        trex.velocityY = trex.velocityY+0.8;
        
        if(ground.x<0){
            ground.x = ground.width/2;
        }
        trex.collide(inVisibleGround);
    
        spawnclouds();
        spawnObstacles();

        if(score>0 && score%100 === 0){
            checkPointSound.play();
        }
        if(obstaclesGroup.isTouching(trex)){
            dieSound.play();
            gameState = END;
        }
    }
    else if(gameState === END){
        gameOve.visible = true;
        reStartimg.visible = true;

        ground.velocityX = 0;
        trex.velocityY = 0;

        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        trex.changeAnimation("collided",trex_collided);

        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);


        if(mousePressedOver(reStart)){
            reset();
        }
    }
    drawSprites();
}

function spawnclouds(){
    if(frameCount % 60 === 0){
        var cloud = createSprite(600,120,40,10);
        cloud.y = Math.round(random(80,120));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;
        cloud.lifetime = 200;
        cloud.depth = trex.depth;
        trex.depth= trex.depth+1;
        cloudsGroup.add(cloud);

    }
}

function spawnObstacles(){
    if(frameCount % 60 === 0){
        var obstacle = createSprite(600,165,10,40);
        obstacle.velocityX = -(6 +3* score/100);
        var rand = Math.round(random(1,6));
        switch(rand){
            case 1: obstacle.addImage(obtacles1);
            break;
            case 2: obstacle.addImage(obtacles2);
            break;
            case 3: obstacle.addImage(obtacles3);
            break;
            case 4: obstacle.addImage(obtacles4);
            break;
            case 5: obstacle.addImage(obtacles5);
            break;
            case 6: obstacle.addImage(obtacles6);
            break;
            default: break;
        }
        obstacle.scale = 0.5;
        obstacle.lifetime = 300;
        obstaclesGroup.add(obstacle);
    }
}

function reset(){
    gameState = PLAY;
    ground.velocityX = -(6+3*score/100);
    gameOve.visible = false;
    reStart.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("running",trex_running);
    score = 0;
}