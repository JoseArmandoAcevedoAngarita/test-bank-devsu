import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancialProductsService } from './financial-products.service';
import { CreateFinancialProductDTO, FinancialProduct, ReponseCreateFinancialProduct } from '../models/financial-products.model';
import { environment } from '../../environments/environment.prod';

describe('FinancialProductsService', () => {
  let service: FinancialProductsService;
  let httpMock: HttpTestingController;
  const apiURL = environment.API_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialProductsService]
    });
    service = TestBed.inject(FinancialProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call IDCheck and return the result', () => {
    const id = '123';
    const dummyResponse = { isValid: true };

    service.IDCheck(id).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${apiURL}/bp/products/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should retrieve financial products', () => {
    const dummyProducts: { data: FinancialProduct[] } = {
      data: [
        { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2022-01-01', date_revision: '2023-01-01' },
        { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: '2022-02-01', date_revision: '2023-02-01' }
      ]
    };

    service.getFinancialProducts().subscribe(products => {
      expect(products.data.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${apiURL}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should create a financial product and return the response', () => {
    const newProduct: CreateFinancialProductDTO = { 
      id: '3', 
      name: 'Product 3', 
      description: 'Description 3', 
      logo: 'logo3.png', 
      date_release: '2022-03-01', 
      date_revision: '2023-03-01' 
    };
    const dummyResponse: ReponseCreateFinancialProduct = { 
      data: newProduct, 
      message: 'Product created successfully' 
    };

    service.createFinancialProduct(newProduct).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${apiURL}/bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(dummyResponse);
  });

  it('should delete a financial product and return the response', () => {
    const id = '1';
    const dummyResponse = { success: true };

    service.deleteFinancialProduct(id).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${apiURL}/bp/products/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });
});
