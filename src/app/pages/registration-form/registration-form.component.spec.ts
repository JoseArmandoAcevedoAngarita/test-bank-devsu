import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationFormComponent } from './registration-form.component';
import { FinancialProductsService } from '../../services/financial-products.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addYears } from 'date-fns';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let financialProductsService: jasmine.SpyObj<FinancialProductsService>;

  beforeEach(async () => {
    const financialProductsServiceSpy = jasmine.createSpyObj('FinancialProductsService', ['IDCheck']);
    const activatedRouteStub = {
      snapshot: {
        data: { state: 'edit' },
        queryParams: { form: JSON.stringify({ id: '123', name: 'Test Product', description: 'Test Description', logo: 'test-logo.png', date_release: '2023-07-28' }) }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        RegistrationFormComponent
      ],
      providers: [
        { provide: FinancialProductsService, useValue: financialProductsServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub 
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    financialProductsService = TestBed.inject(FinancialProductsService) as jasmine.SpyObj<FinancialProductsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update reviewDate when releaseDate changes', () => {
    const releaseDate = new Date('2023-07-28');
    component.form.get('releaseDate')?.setValue(releaseDate);
    fixture.detectChanges();

    expect(component.form.get('reviewDate')?.value).toEqual(addYears(releaseDate, 1));
  });

  it('should unsubscribe from createFinancialProduct on destroy', () => {
    component.createFinancialProduct = of().subscribe();
    spyOn(component.createFinancialProduct, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.createFinancialProduct.unsubscribe).toHaveBeenCalled();
  });
});
