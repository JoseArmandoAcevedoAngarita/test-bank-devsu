import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFinancialProductDTO, FinancialProduct, ReponseCreateFinancialProduct } from '../models/financial-products.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FinancialProductsService {

  apiURL = environment.API_URL;

  constructor(
    private http: HttpClient,
  ) { }

  IDCheck(id: string){
    return this.http.get<any>(this.apiURL + '/bp/products/verification/' + id);
  }

  getFinancialProducts(): Observable<{data: FinancialProduct[]}>{
    return this.http.get<{data: FinancialProduct[]}>(this.apiURL + '/bp/products');
  }
  
  createFinancialProduct(data: CreateFinancialProductDTO): Observable<ReponseCreateFinancialProduct>{
    return this.http.post<ReponseCreateFinancialProduct>(this.apiURL + '/bp/products', data);
  }
  
  updateFinancialProduct(data: CreateFinancialProductDTO): Observable<ReponseCreateFinancialProduct>{
    return this.http.put<ReponseCreateFinancialProduct>(this.apiURL + '/bp/products/' + data.id , data);
  }
  
  deleteFinancialProduct(id: string): Observable<any>{
    return this.http.delete<any>(this.apiURL + `/bp/products/${id}`);
  }

}
