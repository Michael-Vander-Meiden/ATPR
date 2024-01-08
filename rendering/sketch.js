let ellipses = [];
let apiNumber = dailyNumber;  // Assuming dailyNumber is defined elsewhere
let normalizedInput = dailyNumber / 42000;
normalizedInput = Math.min(normalizedInput, 1);

const uniformProperties = { speed: 0.02, radius: 300 };
const chaoticProperties = { speedRange: [0.01, 0.08], radiusRange: [150, 450] };

let blurEffect;

function setup() {
  createCanvas(1000, 1000);
  colorMode(RGB);

  // Create a manual blur effect
  createBlurEffect();


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

function createBlurEffect() {
  blurEffect = createGraphics(1000, 1000);
  blurEffect.translate(blurEffect.width / 2, blurEffect.height / 2);
  
  const maxDiameter = 450;
  const steps = 100; // Adjust number of steps for a smoother gradient

  for (let i = steps; i >= 0; i--) {
    let diameter = (maxDiameter / steps) * i;
    let opacity = (10 / steps) * i;
    let c = color('#ff0303');
    c.setAlpha(opacity);
    blurEffect.fill(c);
    blurEffect.noStroke();
    blurEffect.ellipse(0, 0, diameter, diameter);
  }
}


function draw() {
  background("#EBF3F3");
  translate(width / 2, height / 2);

  let opacity = normalizedInput * 255;
  tint(255, opacity);
  //draw circle
  // Draw the buffered blur circle
  image(blurEffect, -width / 2, -height / 2);
  noTint();

  fill('#EBF3F3')
  noStroke();
  ellipse(0, 0, 350, 350); // gray center

  ellipses.forEach((ellipseData) => {
    ellipseData.trail.push({ x: ellipseData.radiusX * cos(ellipseData.angle), y: ellipseData.radiusY * sin(ellipseData.angle) });
    if (ellipseData.trail.length > 10) {
      ellipseData.trail.shift();
    }

    // Adjust trail opacity based on normalizedInput
    let trailOpacity = map(normalizedInput, 0, 1, 50, 0);
    noStroke(); 

    fill(ellipseData.color.levels[0], ellipseData.color.levels[1], ellipseData.color.levels[2], trailOpacity);

    for (let pos of ellipseData.trail) {
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
