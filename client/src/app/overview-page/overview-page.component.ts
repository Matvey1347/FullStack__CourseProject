import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OverviewPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
})
export class OverviewPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tapTarget') tapTargetRef!: ElementRef;

  data$!: Observable<OverviewPage>;
  tabTarget: MaterialInstance | any;
  yesterday = new Date();

  constructor(private service: AnalyticsService) { }

  ngOnInit(): void {
    this.data$ = this.service.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tabTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  openInfo() {
    this.tabTarget.open();
  }

  ngOnDestroy(): void {
    this.tabTarget.destroy();
  }
}
