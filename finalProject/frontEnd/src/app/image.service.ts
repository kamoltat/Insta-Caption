import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  getImage(imgId:string){
    return 'http://localhost:3000/get/' + imgId;
  }

  delImage(imgId:string){
  }



}
