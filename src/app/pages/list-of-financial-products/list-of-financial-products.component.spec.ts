import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync, flush } from '@angular/core/testing';
import { ListOfFinancialProductsComponent } from './list-of-financial-products.component';
import { FinancialProductsService } from '../../services/financial-products.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FinancialProduct } from '../../models/financial-products.model';

describe('ListOfFinancialProductsComponent', () => {
  let component: ListOfFinancialProductsComponent;
  let fixture: ComponentFixture<ListOfFinancialProductsComponent>;
  let financialProductsService: jasmine.SpyObj<FinancialProductsService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const financialProductsServiceSpy = jasmine.createSpyObj('FinancialProductsService', ['getFinancialProducts', 'deleteFinancialProduct']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListOfFinancialProductsComponent], // Importa el componente standalone aquí
      providers: [
        { provide: FinancialProductsService, useValue: financialProductsServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfFinancialProductsComponent);
    component = fixture.componentInstance;
    financialProductsService = TestBed.inject(FinancialProductsService) as jasmine.SpyObj<FinancialProductsService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.status).toBe('init');
    expect(component.filter).toBe('');
    expect(component.pageSize).toBe(5);
    expect(component.pageIndex).toBe(0);
    expect(component.financialProducts).toEqual([]);
  });

  it('should call getFinancialProducts on init', () => {
    spyOn(component, 'getFinancialProducts');
    component.ngOnInit();
    expect(component.getFinancialProducts).toHaveBeenCalled();
  });

 /*  it('should set status to loading and then to success after fetching financial products', fakeAsync(() => {
    const mockProducts: FinancialProduct[] = [
      { id: '1', name: 'Product 1', description: '', logo: '', date_release: '', date_revision: '' }
    ];
    financialProductsService.getFinancialProducts.and.returnValue(of({ data: mockProducts }));

    component.getFinancialProducts();

    expect(component.status).toBe('loading');
    expect(financialProductsService.getFinancialProducts).toHaveBeenCalled();

    flush();

    expect(component.financialProducts).toEqual(mockProducts);
    expect(component.status).toBe('success');
  })); */

  it('should handle error when fetching financial products', () => {
    financialProductsService.getFinancialProducts.and.returnValue(throwError(() => new Error('error')));

    spyOn(component, 'openDialogAlert');
    component.getFinancialProducts();

    expect(component.status).toBe('failed');
    expect(component.openDialogAlert).toHaveBeenCalledWith('Ha ocurrido un error al cargar los datos, vuelva a intentarlo.');
  });

  // Add more tests for other methods like setPageSize, openDialog, deleteProduct, etc.
});
