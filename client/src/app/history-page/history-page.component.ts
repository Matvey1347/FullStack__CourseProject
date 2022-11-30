import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { DestroySubscription } from '../shared/destroy-subscription';
import { Filter, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
})
export class HistoryPageComponent extends DestroySubscription implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip: MaterialInstance | any;
  isFilterVisible = false;
  orders: Order[] = [];

  offset = 0;
  limit = STEP;
  filter: Filter = {};

  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService) { 
    super();
  }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }
  
  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }
  
  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });
    console.log(params);
    
    this.ordersService.fetch(params)
    .pipe(takeUntil(this.destroyStream$))
    .subscribe(
      (orders: Order[]) => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders[orders.length - 1]?.order === 1;
        this.loading = false;
        this.reloading = false;
      }
    )
  }

  loadMore() {
    this.loading = true;
    this.offset += STEP;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch()
  }

  isFilterRed(): boolean {
    return !!Object.keys(this.filter).length
  }

}
