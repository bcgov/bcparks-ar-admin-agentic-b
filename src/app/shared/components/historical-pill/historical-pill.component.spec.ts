import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricalPillComponent } from './historical-pill.component';

describe('HistoricalPillComponent', () => {
  let component: HistoricalPillComponent;
  let fixture: ComponentFixture<HistoricalPillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalPillComponent]
    });
    fixture = TestBed.createComponent(HistoricalPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should highlight typeahead properly with plain text segments', () => {
    expect(component.getHighlightedMatch({ value: 'string' }, ['str'])).toEqual({
      left: '',
      highlight: 'str',
      right: 'ing',
    });
  });

  // criterion: @R-24.2 — VULN-001 malicious sub-area name stays literal text
  it('should return malicious markup as plain text segments', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const result = component.getHighlightedMatch({ value: malicious }, ['img']);

    expect(result.highlight).toBe('img');
    expect(result.left).toBe('<');
    expect(result.right).toContain('onerror=alert(1)>');
    expect(JSON.stringify(result)).not.toContain('<span>');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
