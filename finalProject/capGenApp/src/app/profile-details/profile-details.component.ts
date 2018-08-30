import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../user.service";
import {User} from '../user';
@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService,private location: Location) { }

  public id:string;
  public user: User;
  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.userService.getUser(this.id)
      .subscribe(user => this.user = user);
  }
}
