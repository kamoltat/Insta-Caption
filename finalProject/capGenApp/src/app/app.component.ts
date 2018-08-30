import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//@Injectable() lets Angular 2 know that a class can be used with the dependency injector.
@Injectable()
export class AppComponent {
  constructor(private http: HttpClient) {}
  title = 'InstaCaption';
}
