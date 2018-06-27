import {Component, Input, OnInit} from '@angular/core';
import {Word} from '../word';
// import {WordService} from '../word.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class WordComponent implements OnInit {
  selectedWord: Word;

  @Input() words: Array<Word>;

  constructor() {}


  onSelect(word: Word): void {
    this.selectedWord = word;
  }

  ngOnInit() {
      // this.getWords();

  }

  // getWords(wordArray): void {
  //   //function waits for the Observable to emit the array of words—
  //   // which could happen now or several minutes from now.
  //   // Then subscribe passes the emitted array to the callback, which sets the component's word property.
  //   this.wordService.getWords()
  //     .subscribe(words => this.words = words);
  //
  // }

}
