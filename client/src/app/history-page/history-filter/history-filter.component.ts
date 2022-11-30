import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { MaterialDatepicker, MaterialService } from 'src/app/shared/classes/material.service';
import { Filter } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
})
export class HistoryFilterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('start') startRef!: ElementRef;
  @ViewChild('end') endRef!: ElementRef;

  @Output() onFilter = new EventEmitter<Filter>;

  start: MaterialDatepicker | any;
  end: MaterialDatepicker | any;
  order!: number;
  isValid = true;

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  validate() {
    if(!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  submitFilter() {
    const filter: Filter = {};

    if(this.order) {
      filter.order = this.order;
    }

    if(this.start.date) {
      filter.start = this.start.date;
    }

    if(this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }
}