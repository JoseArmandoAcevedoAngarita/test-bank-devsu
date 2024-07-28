import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Page404Component } from './page-404.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('Page404Component', () => {
  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Page404Component, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(Page404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 404 error message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('404');
    expect(compiled.querySelector('p')?.textContent).toContain('Algo falta, algo está faltando.');
  });

  it('should display correct description message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('p:nth-of-type(2)');
    expect(description?.textContent).toContain('Lo sentimos, no podemos encontrar esa página.');
  });

  it('should have a link to the homepage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[routerLink]');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('routerLink')).toBe('/');
  });

  it('should have correct button text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.textContent).toContain('Volver a la página de inicio');
  });
});
