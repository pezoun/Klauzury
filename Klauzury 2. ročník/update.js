const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

// Vytvoření mapy kolizí
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 44) {
    collisionsMap.push(collisions.slice(i, 44 + i));
}

class Boundary {
    static width = 32;
    static height = 32;

    constructor({ position }) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1441) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width,
                    y: i * Boundary.height
                }
            }));
        }
    });
});

// Načtení obrázků
const image = new Image();
image.src = '/images/Normandy.png';  // Zkontroluj cestu k pozadí

const playerImage = new Image();
playerImage.src = '/images/Panzer_down.png';  // Zkontroluj cestu k obrázku hráče

class Sprite {
    constructor({ position, image, width, height, frames = { max: 1 } }) {
        this.position = position;
        this.image = image;
        this.width = width;
        this.height = height;
        this.frames = {
            max: frames.max,
            current: 0,
        };

        // Výpočet šířky snímku po načtení obrázku
        this.image.onload = () => {
            this.frameWidth = this.image.width / this.frames.max;
            this.height = this.image.height;
            console.log('Image loaded:', this.image.src);  // Informace o načtení obrázku
        };
    }

    draw() {
        // Vykreslujeme obrázek, pokud je plně načten
        c.drawImage(
            this.image,
            this.frames.current * this.frameWidth, // Horizontální posun na sprite sheetu
            0, // Vertikální posun
            this.frameWidth,
            this.height,
            this.position.x,
            this.position.y,
            this.frameWidth,
            this.height
        );
    }
}

// Vytvoření hráče
const player = new Sprite({
    position: {
        x: canvas.width / 2 - 197 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    width: 197,
    height: 68,
    frames: {
        max: 4 // Počet snímků v animaci
    }
});

// Vytvoření pozadí
const background = new Sprite({
    position: { x: 0, y: 0 },
    image: image,
    width: canvas.width,
    height: canvas.height
});

const speed = 2;

// Klávesy pro pohyb hráče
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Funkce pro detekci kolize
function rectangularCollission({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.frameWidth >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

// Funkce pro animaci
function animate() {

    window.requestAnimationFrame(animate);

    // Vymažeme předchozí frame
    c.clearRect(0, 0, canvas.width, canvas.height);

    
    // Vykreslíme pozadí
    background.draw();

    // Vykreslíme překážky a zkontrolujeme kolize
    boundaries.forEach((boundary) => {
        boundary.draw();

        if (rectangularCollission({
            rectangle1: player,
            rectangle2: boundary
        })) {
            console.log('colliding');
        }
    });

    // Vykreslíme hráče
    player.draw();

    // Pohyb hráče
    if (keys.w) player.position.y -= speed;
    if (keys.s) player.position.y += speed;
    if (keys.a) player.position.x -= speed;
    if (keys.d) player.position.x += speed;
}

// Spuštění animace až po načtení obrázků
image.onload = () => {
    console.log("Pozadí načteno.");
    playerImage.onload = () => {
        console.log("Hráč načten.");
        animate();  // Animace se spustí až po načtení obou obrázků
    };
};

// Ovládání kláves
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
