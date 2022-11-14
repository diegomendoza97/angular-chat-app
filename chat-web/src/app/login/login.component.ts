import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    console.log(this.form);
    this.userService.login(this.form.value).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }
}
