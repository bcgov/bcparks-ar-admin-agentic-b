import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService (TEST-004)', () => {
  let service: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('initialises item on setItemValue', () => {
    service.setItemValue('test-id', 'value');
    expect(service.getItemValue('test-id')).toBe('value');
  });

  it('watchItem emits updates', (done) => {
    service.watchItem('watch-id').subscribe((v) => {
      if (v === 'updated') { done(); }
    });
    service.setItemValue('watch-id', 'updated');
  });

  it('appendItemValue concatenates arrays', () => {
    service.setItemValue('arr-id', [1]);
    service.appendItemValue('arr-id', [2]);
    expect(service.getItemValue('arr-id')).toEqual([1, 2]);
  });
});
