import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Output() searchTerm = new EventEmitter<string>();
  @Input() options: Array<{ checked: boolean, hint: string, icon: string, color: string }>;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() { }

  searchBarClick(focusElement, event: MouseEvent) {
    event.preventDefault();
    setTimeout(() => {
      // Delay the focus 300ms (time it takes to expand)
      focusElement.focus();
    }, 300);
  }
}
