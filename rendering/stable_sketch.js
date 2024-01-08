let atprBackground;

function preload() {
  atprBackground = loadImage('atpr_background.png');
}

let ellipses = [];
let apiNumber = dailyNumber;  // Assuming dailyNumber is defined elsewhere
let normalizedInput = dailyNumber / 42000;
normalizedInput = Math.min(normalizedInput, 1);

const uniformProperties = { speed: 0.02, radius: 300 };
const chaoticProperties = { speedRange: [0.01, 0.08], radiusRange: [150, 450] };

function setup() {
  createCanvas(1000, 1000);
  colorMode(RGB);

  const colors = [
    color('#C0D461'), color('#E9CE2C'), color('#F0544F'),
    color('#81D6E3'), color('#E76B74'), color('#F9DC5C'), color('#AEF78E')
  ];

  const angleIncrement = TWO_PI / 7;
  for (let i = 0; i < 7; i++) {
    const interp = lerpValue(chaoticProperties, uniformProperties, normalizedInput);
    ellipses.push({
      color: colors[i],
      speed: interp.speed,
      radiusX: interp.radius,
      radiusY: interp.radius,
      angle: i * angleIncrement,
      trail: []
    });
  }
}

function draw() {
  background("#EBF3F3");
  translate(width / 2, height / 2);

  let opacity = normalizedInput * 255;
  tint(255, opacity);
  image(atprBackground, -atprBackground.width / 2, -atprBackground.height / 2);
  noTint();

  ellipses.forEach((ellipseData) => {
    ellipseData.trail.push({ x: ellipseData.radiusX * cos(ellipseData.angle), y: ellipseData.radiusY * sin(ellipseData.angle) });
    if (ellipseData.trail.length > 10) {
      ellipseData.trail.shift();
    }

    // Adjust trail opacity based on normalizedInput
    let trailOpacity = map(normalizedInput, 0, 1, 50, 0);
    noStroke(); 
    for (let pos of ellipseData.trail) {
      fill(ellipseData.color.levels[0], ellipseData.color.levels[1], ellipseData.color.levels[2], trailOpacity);
      ellipse(pos.x, pos.y, 80, 80);
    }

    fill(ellipseData.color);
    stroke(ellipseData.color); 
    let x = ellipseData.radiusX * cos(ellipseData.angle);
    let y = ellipseData.radiusY * sin(ellipseData.angle);
    ellipse(x, y, 80, 80);

    ellipseData.angle += ellipseData.speed;
  });
}

function lerpValue(chaotic, uniform, t) {
  return {
    speed: lerp(random(chaotic.speedRange[0], chaotic.speedRange[1]), uniform.speed, t),
    radius: lerp(random(chaotic.radiusRange[0], chaotic.radiusRange[1]), uniform.radius, t)
  };
}
