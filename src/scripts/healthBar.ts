import { TextStyle, Text, Graphics, Application } from "pixi.js";

//Add resize function

export class healthBar {
  lives: number;
  health: number;
  graph: Graphics;
  app: Application;
  livesText: Text;
  healthText: Text;
  sta: string;
  x: number;
  y: number;
  xs: number;
  ys: number;
  basex: number;
  basey: number;
  basesx: number;
  basesy: number;
  backround: Graphics;
  constructor(app, player, health, lives) {
    this.lives = lives;
    this.health = health;
    this.app = app;
    this.graph = new Graphics();
    this.sta = "green";

    if (player === "player1") {
      this.basex = 15;
    } else {
      this.basex = 330;
    }

    this.basey = 175;
    this.basesx = 150;
    this.basesy = 5;

    //@ts-ignore
    let xy = this.app.toPos({ x: this.basex, y: this.basey });
    //@ts-ignore
    let size = this.app.toPos({ x: this.basesx, y: this.basesy });

    this.x = xy.x;
    this.y = xy.y;
    this.xs = size.x;
    this.ys = size.y;

    this.backround = new Graphics();

    //@ts-ignore
    let bxy = this.app.toPos({ x: this.basex - 10, y: this.basey - 10 });
    //@ts-ignore
    let bsize = this.app.toPos({ x: this.basesx + 10, y: this.basesy + 10 });

    this.backround.lineStyle(4, 0xffffff);
    this.backround.beginFill(0x55335a, 1);
    this.backround.drawRect(bxy.x, bxy.y, bsize.x, bsize.y);
    this.backround.endFill();
    //@ts-ignore
    this.backround.zIndex = 9;

    this.app.stage.addChild(this.backround);

    this.graph.beginFill(0x00ff00);
    this.graph.x = 10;
    this.graph.y = 10;
    this.graph.drawRect(0, 0, 200, 50);
    this.graph.endFill();

    this.app.stage.addChild(this.graph);

    const healthStyle = new TextStyle({
      fill: ["#ffffff"]
    });
    const livesStyle = new TextStyle({
      fill: ["#ffff00"],
      fontSize: 20
    });

    this.livesText = new Text(this.lives.toString(), livesStyle);
    this.livesText.x = 200;
    this.livesText.y = 50;

    app.stage.addChild(this.livesText);

    //@ts-ignore
    this.livesText.zIndex = 10;

    this.healthText = new Text(this.health.toString(), healthStyle);
    this.healthText.x = 200;
    this.healthText.y = 100;

    app.stage.addChild(this.healthText);

    //@ts-ignore
    this.healthText.zIndex = 10;

    this.graph.x = 0;
    this.graph.y = 0;

    //@ts-ignore
    this.graph.zIndex = 9;
  }

  update = (health, lives) => {
    this.lives = lives;
    this.health = health;
    this.livesText.text = this.lives.toString();
    this.healthText.text = this.health.toString();
    this.graph.scale.x = 0.01 * health;

    if (this.health > 70 && this.sta !== "green") {
      this.graph.clear();
      this.sta = "green";
      this.drawBar(0x00ff00);
    } else if (this.health > 30 && this.health <= 70 && this.sta !== "orange") {
      this.graph.clear();
      this.sta = "orange";
      this.drawBar(0xffff00);
    } else if (this.health <= 30 && this.sta !== "red") {
      this.graph.clear();
      this.sta = "red";
      this.drawBar(0xff0000);
    }
  };

  resize() {
    //@ts-ignore
    let xy = this.app.toPos({ x: this.basex, y: this.basey });
    //@ts-ignore
    let size = this.app.toPos({ x: this.basesx, y: this.basesy });
    this.x = xy.x;
    this.y = xy.y;
    this.xs = size.x;
    this.ys = size.y;

    //@ts-ignore
    let hxy = this.app.toPos({ x: this.basex, y: this.basey + 6 });
    //@ts-ignore
    let lxy = this.app.toPos({
      x: this.basex + (this.basesx - 12),
      y: this.basey + 6
    });

    //@ts-ignore
    let bxy = this.app.toPos({ x: this.basex - 10, y: this.basey - 10 });
    //@ts-ignore
    let bsize = this.app.toPos({ x: this.basesx + 20, y: this.basesy + 30 });

    this.backround.clear();
    this.backround.lineStyle(4, 0xffffff);
    this.backround.beginFill(0x55335a, 1);
    this.backround.drawRect(bxy.x, bxy.y, bsize.x, bsize.y);
    this.backround.endFill();

    this.livesText.x = lxy.x;
    this.livesText.y = lxy.y;

    this.healthText.x = hxy.x;
    this.healthText.y = hxy.y;

    if (this.sta === "green") {
      this.graph.clear();
      this.drawBar(0x00ff00);
    } else if (this.sta === "orange") {
      this.graph.clear();
      this.drawBar(0xffff00);
    } else if (this.sta === "red") {
      this.graph.clear();
      this.drawBar(0xff0000);
    }
  }

  private drawBar(color) {
    this.graph.beginFill(color);
    this.graph.x = this.x;
    this.graph.y = this.y;
    this.graph.drawRect(0, 0, this.xs, this.ys);
    this.graph.endFill();
  }
}
