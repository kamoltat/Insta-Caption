import {Component, Input, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {Word} from '../word';
import {ImageService} from '../image.service';

const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
  public words: Array<Word>;
  constructor(private imageService: ImageService) {
  }
  private imgId: string;

  @Input()
  private url = '';


  // async GetAndDelete(imgId){
  //   this.url = await this.imageService.getImage(imgId);
  //
  // }

  ngOnInit() {

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      this.words = JSON.parse(response).body;
      alert('File uploaded successfully');
      this.url = 'http://localhost:3000/get/' + JSON.parse(response).head;
      // this.GetAndDelete(JSON.parse(response).head);
      // this.url = this.imageService.getImage(this.imgId);


      }
  }
}
