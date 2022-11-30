import { Component, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { DestroySubscription } from '../shared/destroy-subscription';
import { Category } from '../shared/interfaces';
import { CategoriesService } from '../shared/services/categories.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
})
export class CategoriesPageComponent extends DestroySubscription implements OnInit {
  categories$!: Observable<Category[]>;

  constructor(private categoriesService: CategoriesService) {
    super();
  }

  ngOnInit(): void {
    this.categories$ = this.categoriesService
      .fetch();
  }

}