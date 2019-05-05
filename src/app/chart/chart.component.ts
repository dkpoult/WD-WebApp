import { Component, Input, ViewChild, AfterViewInit, ElementRef, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnChanges {

  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;

  @Input() radius = 200;
  @Input() arcMult = 0.5;

  @Input() labels: string[];
  // private _DATA = new BehaviorSubject<number[]>([]);
  // @Input() set data(value: number[]) {
  //   this._DATA.next(value);
  // }
  // get data() {
  //   return this._DATA.getValue();
  // }
  @Input() data: number[];

  constructor() { }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.draw();
    }
  }

  draw() {
    let total = 0;
    for (const d of this.data) {
      total = total + d;
    }
    this.ctx.translate(this.radius, this.radius); // Move to center
    this.ctx.rotate(Math.PI / this.data.length);

    this.ctx.lineWidth = this.radius * this.arcMult;
    let alpha = 0;
    for (let i = 0; i < this.data.length; i++) {
      const d = this.data[i];
      const l = this.labels[i];



      const perc = d / total;
      const beta = alpha + perc * 2 * Math.PI;
      this.ctx.strokeStyle = this.getRandomColor();
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.radius * (1 - this.arcMult / 2), alpha, beta);
      this.ctx.stroke();
      this.ctx.closePath();
      alpha = beta;
    }
  }

  getRandomColor() {
    const r = Math.floor(256 * Math.random());
    const g = Math.floor(256 * Math.random());
    const b = Math.floor(256 * Math.random());
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}
