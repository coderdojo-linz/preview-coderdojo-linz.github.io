const state = {
    READY: 'Ready',
    RUNNING: 'Running',
    GAMEOVER: 'Game Over',
    LEVELFINISHED: 'Level Finished',
    FINISHED: 'Finished',
    RESTART: 'Restart'
};

// sprites
let ground, yeti, sky, btnStart, candy;
let speed = 2;
let yetiSpeed = 3;
let gravity = 0.3;
let jump = -10;
let canJump = true;
let skyImage, earthImage, surfaceImage, trapImage, btnStartImage, candyImage;
let backgroundPosition = 0;
let sceneWidth = 1000;
let gameState = state.READY;
let config;
let level = 1;

this.focus();

function preload() {
    // background
    skyImage = loadImage('assets/background.png');
    earthImage = loadImage('assets/earth.png');
    surfaceImage = loadImage('assets/surface.png');
    trapImage = loadImage('assets/surface-danger.png');
    btnStartImage = loadImage('assets/btn-start.png');
    candyImage = loadImage('assets/candy.png');

    config = loadJSON('js/config.json');
}

function setup() {
    createCanvas(600, 500);

    setupSky();
    setupGround();
    setupYeti();

    // candy sprite
    candy = createSprite(config.levels[level - 1].length * 50 - 75, 350, 50, 50);
    candy.setCollider('rectangle', 0, 0, 20, 50);
    candy.addImage(candyImage);

    // button sprites
    btnStart = createSprite(width / 2, height / 2 - 30);
    btnStart.addImage(btnStartImage);
    btnStart.scale = 0.5;
    btnStart.onMousePressed = () => {
        if (btnStart.visible) {
            start();
        }
    }
}

function draw() {
    clear();
    drawSky();

    // level
    textSize(12);
    textStyle(BOLD);
    noStroke();
    fill('#02b7e3');
    rect(0, 0, width, 30);
    fill('white');
    text('Level: ' + level.toString() + '     State: ' + gameState.toString(), 10, 20);

    // sprites
    drawYeti();
    drawSprites();

    // game state
    if (gameState === state.GAMEOVER) {
        fill('red');
        textSize(60);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text('GAME OVER', width / 2, height / 2);
    } else if (gameState === state.LEVELFINISHED) {
        fill('#a0e302');
        textSize(60);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text('LEVEL DONE', width / 2, height / 2);
    } else if (gameState === state.FINISHED) {
        fill('#a0e302');
        textSize(60);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text('YOU WON!!!', width / 2, height / 2);
    }
}

function keyPressed() {
    yetiKeyPressed();

    if (keyCode === 32 && (gameState == state.READY || gameState == state.RESTART)) {
        start();
    }
}

function start() {
    gameState = state.RUNNING;
    btnStart.visible = false;

    sky.forEach(i => i.velocity.x = speed * -1);
    ground.forEach(i => i.velocity.x = speed * -1);
    traps.forEach(i => i.velocity.x = speed * -1);
    candy.velocity.x = speed * -1;

    yeti.changeAnimation('walk');
}

function stop() {
    // stop all sprites
    sky.forEach(i => i.velocity.x = 0);
    ground.forEach(i => i.velocity.x = 0);
    traps.forEach(i => i.velocity.x = 0);
    yeti.velocity.x = 0;
    candy.velocity.x = 0;
}

function restart() {
    setTimeout(() => {
        if (gameState === state.LEVELFINISHED) {
            level++;
        }

        gameState = state.RESTART;

        sky.removeSprites();
        ground.removeSprites();
        traps.removeSprites();
        yeti.remove();
        candy.remove();
        btnStart.remove();

        setup();

        btnStart.visible = true;
    }, 3000);
}