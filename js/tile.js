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

  drawSnake(startX,startY,endX,endY){
    strokeWeight(12.0);
    strokeCap(ROUND);
    stroke(255, 0, 0, 200);
    bezier(startX, startY, startY-10, startY-10, endY+10, endY+10, endX, endY);
  }
  drawLadder(startX,startY,endX,endY){
    stroke(0, 255, 0, 200);
    line(startX, startY, endX, endY);
    line(startX-10, startY, endX-10, endY);
  }
}
