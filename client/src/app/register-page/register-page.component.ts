import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { DestroySubscription } from '../shared/destroy-subscription';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent extends DestroySubscription implements OnInit {
  
    form: FormGroup;
    constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router,
    ) {
      super();
      this.form = fb.group({
        email: fb.control(null, [Validators.required, Validators.email]),
        password: fb.control(null, [Validators.required, Validators.minLength(6)]),
      })
    }
  
    ngOnInit(): void {
    }
  
    onSubmit() {
      this.form.disable();
      this.auth.register(this.form.value)
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(
        () => { 
          this.router.navigate(['/login'], {
            queryParams: {
              registered: true
            }
          })
        },
        error => {
          MaterialService.toast(error.error.message)
          console.warn(error);
          this.form.enable();
        }
      )
    }
  

}
