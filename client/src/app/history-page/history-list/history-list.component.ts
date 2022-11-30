import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { DestroySubscription } from 'src/app/shared/destroy-subscription';
import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
})
export class HistoryListComponent extends DestroySubscription implements AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef;
  @Input() orders!: Order[];

  modal: MaterialInstance | any;
  selectedOrder!: Order;

  constructor() { 
    super();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0)
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeModal() {
    this.modal.close();
  }

}
