import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../services/config.service';
import { KeycloakService } from '../services/keycloak.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockConfigService = jasmine.createSpyObj('ConfigService', {}, { config: { ENVIRONMENT: 'prod'} });
  const mockKeycloakService = jasmine.createSpyObj('KeycloakService', [
    'isAllowed',
    'isAuthorized',
    'isAuthenticated',
    'getWelcomeMessage',
    'logout',
  ]);

  beforeEach(async () => {
    mockKeycloakService.isAllowed.and.returnValue(true);
    mockKeycloakService.isAuthorized.and.returnValue(true);
    mockKeycloakService.isAuthenticated.and.returnValue(true);
    mockKeycloakService.getWelcomeMessage.and.returnValue('Test User');
    mockKeycloakService.logout.calls.reset();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: ConfigService, useValue: mockConfigService
        },
        { provide: KeycloakService, useValue: mockKeycloakService },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  });

  it('should create and not show the banner', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();

    expect(component.showBanner).toBe(false);
  });

  it('should call KeycloakService.logout when logout is invoked', () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.logout();

    expect(mockKeycloakService.logout).toHaveBeenCalled();
  });

  it('should show logout control when authenticated', () => {
    mockKeycloakService.isAuthenticated.and.returnValue(true);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const logoutButtons = fixture.nativeElement.querySelectorAll('button');
    const logoutButton = Array.from<HTMLButtonElement>(logoutButtons).find(
      (btn) => btn.textContent?.trim() === 'Log out'
    );

    expect(logoutButton).toBeTruthy();
  });
});
