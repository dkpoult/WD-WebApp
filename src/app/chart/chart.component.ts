import { Component, Input, ViewChild, AfterViewInit, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  borderWidth = 3;

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
    this.ctx.clearRect(0, 0, (this.radius + this.borderWidth) * 2, (this.radius + this.borderWidth) * 2);
    let total = 0;
    for (const d of this.data) {
      total = total + d;
    }
    this.ctx.translate(this.radius + this.borderWidth, this.radius + this.borderWidth); // Move to center
    this.ctx.rotate(Math.PI / this.data.length);

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'black';

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius * (1 - this.arcMult), 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.lineWidth = this.radius * this.arcMult;
    let alpha = 0;
    for (let i = 0; i < this.data.length; i++) {
      const d = this.data[i];
      const l = this.labels[i];
      const perc = d / total;
      const beta = alpha + perc * 2 * Math.PI;
      this.ctx.strokeStyle = this.getColor(i);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, this.radius * (1 - this.arcMult / 2), alpha, beta);
      this.ctx.stroke();
      this.ctx.closePath();
      alpha = beta;
    }
    this.ctx.resetTransform();
  }

  getRandomColor() {
    const r = Math.floor(256 * Math.random());
    const g = Math.floor(256 * Math.random());
    const b = Math.floor(256 * Math.random());
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  getColor(i: number) {
    const colors = [
      '#d3c589', '#83cdfa', '#403a37', '#f7da9f',
      '#8a4339', '#365782', '#baa3a9', '#f0c9aa',
      '#f6e7e4', '#a5d49f', '#c3acbd', '#f8d0b3',
      '#544440', '#c4a385', '#419c5e', '#6c694d',
      '#633d46', '#e3cfbc', '#fefb70', '#44594e',
      '#b398a8', '#e7cb99', '#ff1060', '#71635e',
      '#c1c190', '#c43d35'
    ];
    return colors[i % colors.length];
  }
}
