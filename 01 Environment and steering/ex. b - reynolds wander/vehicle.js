class Vehicle {
    constructor(x, y) {
      this.acceleration = createVector(0, 0);
      this.velocity = createVector(2, 0);
      this.position = createVector(x, y);
      this.r = 6;
      this.maxspeed = 2;
      this.maxforce = 0.2;

      this.wanderTheta = PI/2;

      this.path = [];
    }
  
    // Method to update location
    update() {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      // Reset accelerationelertion to 0 each cycle
      this.acceleration.mult(0);

      this.path.push(this.position.copy());
      if(this.path.length > 100){
        this.path.shift();
      }
    }
  
    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    }
  
    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    wanderInsideArea(target) {
      let d = 40;
      let desired = null;
  
      if (this.position.x < d) {
        desired = createVector(this.maxspeed, this.velocity.y);
      } else if (this.position.x > width - d) {
        desired = createVector(-this.maxspeed, this.velocity.y);
      }
  
      if (this.position.y < d) {
        desired = createVector(this.velocity.x, this.maxspeed);
      } else if (this.position.y > height - d) {
        desired = createVector(this.velocity.x, -this.maxspeed);
      }
  
      if (desired !== null) {
        desired.normalize();
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
      }
    }

    wanderReynolds(){
      let d = 20;
      let wanderPoint = this.velocity.copy();
      wanderPoint.setMag(100);
      wanderPoint.add(this.position);

      let wanderRadius = 50;

      let theta = this.wanderTheta + this.velocity.heading();
      
      let x = wanderRadius * cos(theta);
      let y = wanderRadius * sin(theta);

      wanderPoint.add(x,y);

      let steer = wanderPoint.sub(this.position);
      steer.setMag(this.maxforce);
      this.applyForce(steer);

      let displacementRange = 0.3;
      this.wanderTheta += random(-displacementRange, displacementRange);
    }
  
    display() {
      // Draw a triangle rotated in the direction of velocity
      let theta = this.velocity.heading() + PI / 2;
      fill(127);
      stroke(200);
      strokeWeight(1);
      push();
      translate(this.position.x, this.position.y);
      rotate(theta);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
      pop();

      beginShape();
      noFill();
      for(let v of this.path){
        vertex(v.x, v.y);
      }
      endShape();
    }
  }
  