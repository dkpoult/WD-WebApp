import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  // all surveys for all courses
  public surveys: any = {};

  constructor() { }

  surveyIsActive(courseCode) {
    return !isNullOrUndefined(this.surveys[courseCode]) && this.surveys[courseCode].active;
  }
}
