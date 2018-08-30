import { Component, OnInit, Input } from '@angular/core';
import { Word } from '../word';

@Component({
  selector: 'app-word-caption',
  templateUrl: './word-caption.component.html',
  styleUrls: ['./word-caption.component.css']
})
export class WordCaptionComponent implements OnInit {

  //parent --> word component
  //child  --> wordCaption
  //we pass the word from word to wordCaption to display the caption

  @Input() word: Word;


  constructor() { }

  ngOnInit() {
  }

  public copyClipBoard(caption: string, artistName:string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = caption + ' - ' + artistName;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert('lyrics copied to clipboard!')
  }
}
