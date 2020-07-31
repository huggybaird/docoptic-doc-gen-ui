import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPromptDialogComponent } from './text-prompt-dialog.component';

describe('TextPromptDialogComponent', () => {
  let component: TextPromptDialogComponent;
  let fixture: ComponentFixture<TextPromptDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextPromptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
