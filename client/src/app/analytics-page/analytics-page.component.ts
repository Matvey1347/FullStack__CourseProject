import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { DestroySubscription } from '../shared/destroy-subscription';
import { AnalyticsPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';
// import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
})
export class AnalyticsPageComponent extends DestroySubscription implements AfterViewInit {

  @ViewChild('gain') gainRef!: ElementRef;
  @ViewChild('order') orderRef!: ElementRef;

  average!: number;
  pending = true;

  constructor(private service: AnalyticsService) {
    super();
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Earnings',
      color: 'rgb(255, 99, 132)'
    }

    this.service.getAnalytics()
    .pipe(takeUntil(this.destroyStream$))
    .subscribe(
      (data: AnalyticsPage) => {
        this.average = data.average;

        gainConfig.labels = data.chart.map(item => item.label);
        gainConfig.data = data.chart.map(item => item.gain);

        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px'

        // new Chart(gainCtx, createChartConfig(gainConfig));

        this.pending = false;
      }
    )
  }

}

function createChartConfig({labels, data, label, color}: any) {
  const returnedData: any = {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  } ;
  return returnedData;
}