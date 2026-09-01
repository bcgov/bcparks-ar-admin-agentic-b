import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { FiscalYearLockService } from '../services/fiscal-year-lock.service';

import { LockRecordsComponent } from './lock-records.component';

describe('LockRecordsComponent', () => {
  let component: LockRecordsComponent;
  let fixture: ComponentFixture<LockRecordsComponent>;
  let fiscalYearLockService: jasmine.SpyObj<FiscalYearLockService>;

  beforeEach(async () => {
    fiscalYearLockService = jasmine.createSpyObj('FiscalYearLockService', [
      'lockUnlockFiscalYear',
    ]);

    await TestBed.configureTestingModule({
      declarations: [LockRecordsComponent],
      imports: [BsDatepickerModule.forRoot()],
      providers: [
        ConfigService,
        DataService,
        { provide: FiscalYearLockService, useValue: fiscalYearLockService },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockRecordsComponent);
    component = fixture.componentInstance;
    component.form.controls['year'].setValue(['2021-04', '2022-03']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('lock/unlock workflow (BW-001)', () => {
    it('should call lockUnlockFiscalYear with lock true on submit', () => {
      component.submit();

      expect(fiscalYearLockService.lockUnlockFiscalYear).toHaveBeenCalledWith(
        '2022',
        true
      );
    });

    it('should call lockUnlockFiscalYear with lock false on unlock', () => {
      component.unlock();

      expect(fiscalYearLockService.lockUnlockFiscalYear).toHaveBeenCalledWith(
        '2022',
        false
      );
    });
  });
});
