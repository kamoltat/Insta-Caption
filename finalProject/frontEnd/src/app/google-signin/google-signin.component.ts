import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.css']
})
export class GoogleSigninComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public signIn(): void{
    this.http.get('http://localhost:3000/auth/google').subscribe(data=> {
      console.log(data)
    });
  }

  ngOnInit() {
  }

}
