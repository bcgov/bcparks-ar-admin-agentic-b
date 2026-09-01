import { Component, Input } from '@angular/core';

export interface HighlightSegments {
  left: string;
  highlight: string;
  right: string;
}

@Component({
    selector: 'app-historical-pill',
    templateUrl: './historical-pill.component.html',
    styleUrls: ['./historical-pill.component.scss'],
    standalone: false
})
export class HistoricalPillComponent {
  @Input() matches: any;
  @Input() query: any;
  @Input() typeaheadTemplateMethods: any;

  // Plain-text segments for template interpolation (VULN-001 — no innerHtml).
  getHighlightedMatch(item, query): HighlightSegments {
    query = query.join(' ');
    const display = item.value;
    const result: HighlightSegments = {
      left: '',
      highlight: '',
      right: '',
    };

    if (display.toLocaleLowerCase().indexOf(query) > -1) {
      const left_str = display.substring(0, display.toLocaleLowerCase().indexOf(query));
      const highlight_str = display.substring(
        display.toLocaleLowerCase().indexOf(query),
        display.toLocaleLowerCase().indexOf(query) + query.length
      );
      const right_str = display.substring(display.toLocaleLowerCase().indexOf(query) + query.length);
      return {
        left: left_str,
        highlight: highlight_str,
        right: right_str,
      };
    }

    result.left = display;
    return result;
  }
}
