import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { DestroySubscription } from '../shared/destroy-subscription';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent extends DestroySubscription implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.form = fb.group({
      email: fb.control(null, [Validators.required, Validators.email]),
      password: fb.control(null, [Validators.required, Validators.minLength(6)]),
    })

    this.route.queryParams
    .subscribe((params: Params) => {
      if(params['registered']) {
        MaterialService.toast('Now ypu can login in our service')
      } else if(params['accessDenied']) {
        MaterialService.toast('Begining register')
      } else if(params['sessionFailed']) {
        MaterialService.toast('Please login again')
      }
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.form.disable();
    this.auth.login(this.form.value)
    .pipe(takeUntil(this.destroyStream$))
    .subscribe(
      () => { 
        this.router.navigate(['/overview'])
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable();
      }
    )
  }

}
