
class Tile {

  constructor(x, y, wh, next) {
    this.x = x;
    this.y = y;
    this.wh = wh;
    this.next = next;
    this.color = random(255);
  }

  show(){
    fill(this.color);
    rect(this.x, this.y, this.wh, this.wh);
  }

}
