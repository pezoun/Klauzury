const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

for(i = 0;i < collisions.length; i += 44 ){
    console.log(collisions.slice(i, 44 + i))
}

const image = new Image();
image.src = '/images/Normandy.png';

const playerImage = new Image();
playerImage.src = './images/Panzer_down.png';

class Sprite {
    constructor(position, image) {
        this.position = position;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite(
    { x: 0, y: 0 },
    image
);

let playerPosition = {
    x: canvas.width / 2 - playerImage.width / 8,
    y: canvas.height / 2 - playerImage.height / 2
};

const speed = 2;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

function animate() {
    window.requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();

    if (keys.w) playerPosition.y -= speed;
    if (keys.s) playerPosition.y += speed;
    if (keys.a) playerPosition.x -= speed;
    if (keys.d) playerPosition.x += speed;

    c.drawImage(
        playerImage,
        0, 0,
        playerImage.width / 4,
        playerImage.height,
        playerPosition.x,
        playerPosition.y,
        playerImage.width / 4,
        playerImage.height
    );
}

image.onload = () => {
    playerImage.onload = () => {
        animate();
    };
};

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w = true;
            break;
        case 'a':
            keys.a = true;
            break;
        case 's':
            keys.s = true;
            break;
        case 'd':
            keys.d = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w = false;
            break;
        case 'a':
            keys.a = false;
            break;
        case 's':
            keys.s = false;
            break;
        case 'd':
            keys.d = false;
            break;
    }
});
