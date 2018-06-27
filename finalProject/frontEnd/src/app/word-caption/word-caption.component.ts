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

}
