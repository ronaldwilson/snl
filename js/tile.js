// Daniel Shiffman
// Snakes and Ladders

// Each tile on the board
class Tile {
  constructor(x, y, wh, index, next) {
    this.x = x;
    this.y = y;
    this.wh = wh;
    // index and next
    // TODO: (next is probably redundant?)
    this.index = index;
    this.next = next;
    this.snadder = 0;

    // Generate random color
      this.color = 'rgb(' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ')';

    // Checkboard pattern
    // if (this.index % 2 == 0) {
    //   this.color = 200;
    // } else {
    //   this.color = 100;
    // }
  }

  // Find center
  getCenter() {
    let cx = this.x + this.wh / 2;
    let cy = this.y + this.wh / 2;
    // TODO: change to p5.Vector?
    return [cx, cy];
  }

  // Draw rectangle
  show() {
    fill(this.color);
    //noStroke();
    strokeWeight(1);
    rect(this.x, this.y, this.wh, this.wh);
  }

  // Draw rectangle
  showNumber() {
    fill(0, 150)
    .strokeWeight(0)
    .textSize(14);
    if(this.index+1 > 9 && this.index+1 < 100){
      text(this.index+1, this.x + (this.wh/2) - 7, this.y + (this.wh/2) + 5);
    }else if(this.index+1 == 100){
      text(this.index+1, this.x + (this.wh/2) - 12, this.y + (this.wh/2) + 5);
    }else{
      text(this.index+1, this.x + (this.wh/2) - 5, this.y + (this.wh/2) + 5);
    }
  }

  // Highlight over rectangle
  highlight() {
    fill(0, 0, 255, 100);
    noStroke();
    rect(this.x, this.y, this.wh, this.wh);
  }

  // If it's connected to another tile
  // with a snake or a ladder
  showSnadders() {
    if (this.snadder != 0) {
      let myCenter = this.getCenter();
      let nextCenter = tiles[this.index + this.snadder].getCenter();
      noFill();
      strokeWeight(4);
      if (this.snadder < 0) {
        this.drawSnake(myCenter[0],myCenter[1],nextCenter[0],nextCenter[1]);
      } else {
        this.drawLadder(myCenter[0],myCenter[1],nextCenter[0],nextCenter[1]);
      }
    }
  }

  // Draw Snakes
  drawSnake(startX,startY,endX,endY){
    strokeWeight(12.0);
    strokeCap(ROUND);
    stroke(255, 0, 0, 200);
    bezier(startX, startY, startY-50, startY-50, endY+50, endY+50, endX, endY);
    stroke('purple'); // Change the color
    strokeWeight(5); // Make the points 10 pixels in size
    point(startX, startY);
    let angleDeg = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    console.log(angleDeg);
  }

  // Draw Ladders
  drawLadder(startX,startY,endX,endY){
    let lineDist = 20;

    stroke(54, 34, 4, 200);
    line(startX, startY, endX, endY);
    line(startX-lineDist, startY, endX-lineDist, endY);

    // Find ladder steps
    let maxV = (this.findLineLength(startX, startY, endX, endY)/20)-1;
    // Strand distance
    let d = 20;

    for(let i=0; i<maxV; i++){
      let npStart = this.findSlopPoints(startX, endX, startY, endY, d);
      let npEnd = this.findSlopPoints(startX-lineDist, endX-lineDist, startY, endY, d);
      line(npStart[0], npStart[1], npEnd[0], npEnd[1]);
      d+=20;
    }
  }

  // Find slop points
  findSlopPoints(startX, endX, startY, endY, d){

    // Distance
    if(startX <= endX){
      d = Math.abs(d) * -1;
    }

    // Find Slope of the line
    let slope = (endY-startY)/(endX-startX);
    // Find angle of line
    var theta = Math.atan(slope);
    // the coordinates of the A3 Point
    var Ax= endX + d * Math.cos(theta);
    var Ay= endY + d * Math.sin(theta);

    return [Ax, Ay];
  }

  // Find line length
  findLineLength(startX, startY, endX, endY){

    var xs = 0;
    var ys = 0;
    xs = endX - startX;
    xs = xs * xs;
    ys = endY - startY;
    ys = ys * ys;

    return Math.round(Math.sqrt( xs + ys ));
  }

}
