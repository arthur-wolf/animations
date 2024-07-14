const SHOW_VECTORS = false; // Toggle to true or false to show/hide vectors
const zoffIncrement = 0.01; // Decrease the increment to make the vectors turn less fast
const fading = 16; // Lower = slower fading
const particleCount = 50000;
const particleMaxSpeed = 2; 

let cols, rows;
let scl = 10; // Scale: distance between each vector
let w, h;
let zoff = 0; // Z-offset for Perlin noise
let flowfield;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
  console.log(windowWidth);
  console.log(windowHeight);
  w = width;
  h = height;
  cols = floor(w / scl);
  rows = floor(h / scl);
  flowfield = new Array(cols * rows);
  
  // Generate particles uniformly across the screen
  for (let i = 0; i < particleCount; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0, fading);
  // Update flowfield
  let yoff = 0;
  for (let y = 0; y <= rows; y++) {
    let xoff = 0;
    for (let x = 0; x <= cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TAU; // Adjust the angle range
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      
      // Draw the vector if SHOW_VECTORS is true
      if (SHOW_VECTORS) {
        stroke(255, 50);
        push();
        translate(x * scl + scl / 2, y * scl + scl / 2);
        rotate(v.heading());
        strokeWeight(1);
        line(0, 0, scl, 0);
        pop();
      }
      
      xoff += 0.1; // Adjust the x increment
    }
    yoff += 0.1; // Adjust the y increment
  }
  zoff += zoffIncrement;

  // Update and display particles
  updateParticules();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);
  flowfield = new Array(cols * rows);
}

function updateParticules() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
 } 

 class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxspeed = particleMaxSpeed;
    this.prevPos = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    if (index < vectors.length) {
      let force = vectors[index];
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke(0, 255, 0, 4);
    strokeWeight(3); // Adjust stroke weight for better visibility
    point(this.pos.x, this.pos.y);
    //line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.pos.y = random(height);
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}
