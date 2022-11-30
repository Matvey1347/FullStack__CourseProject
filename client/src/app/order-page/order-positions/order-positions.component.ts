import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
})
export class OrderPositionsComponent implements OnInit {

  positions$!: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private order: OrderService
  ) { }

  ngOnInit(): void {
    this.positions$ = this.route.params
    .pipe(
      switchMap(
        (params: Params) => {
          return this.positionsService.fetch(params['id']);
        }
      ),
      map(
        (position: Position[]) => {
          return position.map(position => {
            position.quantity = 1;
            return position;
          })
        }
      )
    )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Added ${position.quantity}x -- ${position.name}`)
    this.order.add(position);
  }

}
