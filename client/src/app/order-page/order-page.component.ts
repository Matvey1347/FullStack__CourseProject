import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { expand, takeUntil } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { DestroySubscription } from '../shared/destroy-subscription';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  providers: [OrderService]
})
export class OrderPageComponent extends DestroySubscription implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef!: ElementRef;

  modal: any;
  isRoot!: boolean;
  pending = false;

  constructor(
    private router: Router,
    public order: OrderService,
    private ordersService: OrdersService
  ) { 
    super();
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(
      () => {
        if(event instanceof NavigationEnd) this.isRoot = this.router.url === '/order';
      }
    )
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }

  submit() {
    this.pending = true;
    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item
      })
    }

    this.ordersService.create(order)
    .pipe(takeUntil(this.destroyStream$))
    .subscribe(
      (newOrder) => {
        MaterialService.toast(`The order N${newOrder.order} was added`);
        this.order.clear();
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      },
    )
  }

}
