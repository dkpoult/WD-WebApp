import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { AskQuestionComponent } from 'src/app/chat/live-questions/ask-question/ask-question.component';

@Component({
  selector: 'app-live-questions',
  templateUrl: './live-questions.component.html',
  styleUrls: ['./live-questions.component.scss']
})
export class LiveQuestionsComponent implements OnInit {

  askQuestionDialogRef: MatDialogRef<AskQuestionComponent>;

  @Input() questions: Array<any>;
  get sortedQuestions() { return this.questions.sort((a, b) => b.score - a.score); }

  @Input() canDelete: boolean;

  @Output() newQuestion = new EventEmitter<string>();
  @Output() delete = new EventEmitter<number>();
  @Output() upvote = new EventEmitter<number>();

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  openAskQuestionDialog() {
    this.askQuestionDialogRef = this.dialog.open(AskQuestionComponent);
    this.askQuestionDialogRef.afterClosed().subscribe((question: string) => {
      if (!isNullOrUndefined(question) && question.length > 0) {
        this.newQuestion.emit(question);
      }
    });
  }

  deleteQuestion(id: number) {
    this.delete.emit(id);
  }

  upvoteQuestion(id: number) {
    this.upvote.emit(id);
  }

}
