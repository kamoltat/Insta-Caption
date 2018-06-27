import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCaptionComponent } from './word-caption.component';

describe('WordCaptionComponent', () => {
  let component: WordCaptionComponent;
  let fixture: ComponentFixture<WordCaptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordCaptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
