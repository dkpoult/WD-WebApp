import { Observable } from 'rxjs';
import { HttpClient } from 'selenium-webdriver/http';
import { SharedService } from './shared.service';

export class User {
    constructor(
        public personNumber: string,
        public token: string
    ) { }
}
