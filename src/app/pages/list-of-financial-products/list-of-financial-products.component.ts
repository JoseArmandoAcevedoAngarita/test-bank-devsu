import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/dialog/confirm/confirm.component';
import { FinancialProductsService } from '../../services/financial-products.service';
import { Subscription } from 'rxjs';
import { FinancialProduct } from '../../models/financial-products.model';
import { AlertComponent } from '../../components/dialog/alert/alert.component';
import { AsyncPipe } from '@angular/common';
import { FilterAndPaginatePipe } from '../../pipes/filter-and-paginate.pipe';
import { FormsModule } from '@angular/forms';

type RequestStatus = 'init' | 'success' | 'failed' | 'loading';

@Component({
  selector: 'app-list-of-financial-products',
  standalone: true,
  imports: [RouterModule, MatMenuModule, AsyncPipe, FilterAndPaginatePipe, FormsModule],
  templateUrl: './list-of-financial-products.component.html',
  styleUrl: './list-of-financial-products.component.scss'
})
export class ListOfFinancialProductsComponent implements OnInit, OnDestroy {

  status: RequestStatus = 'init';

  filter: string = '';
  pageSize: number = 5;
  pageIndex: number = 0;

  financialProducts: FinancialProduct[] = [];
  
  readonly dialog = inject(MatDialog);

  getFinancialProductsSubscription!: Subscription;
  deleteFinancialProductsSubscription!: Subscription;

  constructor(
    private financialProductsService: FinancialProductsService,
    private ngZone: NgZone,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.getFinancialProducts();
  }

  ngOnDestroy(): void {
    this.getFinancialProductsSubscription?.unsubscribe();
  }

  getFinancialProducts(){
    this.status = 'loading';
    this.getFinancialProductsSubscription = this.financialProductsService.getFinancialProducts().subscribe({
      next: ({data})=>{
        this.financialProducts = data;
        this.status = 'success';
      },
      error: ()=>{
        this.status = 'failed';
        this.openDialogAlert('Ha ocurrido un error al cargar los datos, vuelva a intentarlo.')
      }
    })
  }

  setPageSize(event: Event){
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.pageSize = parseInt(value);
  }

  openDialog(item: FinancialProduct) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      restoreFocus: false,
      disableClose: true,
      data: item
    });
    dialogRef.afterClosed().subscribe({
      next: (res)=>{
        this.ngZone.run(()=>{
          if(res?.delete){
            this.deleteProduct(item.id);
          }
        })
      }
    });
  }
  
  deleteProduct(id: string){
    this.deleteFinancialProductsSubscription =  this.financialProductsService.deleteFinancialProduct(id)
    .subscribe({
      next: (_)=>{
        this.getFinancialProducts();
      },
      error: (_)=>{
        this.openDialogAlert('Ha ocurrido un error al intentar borrar el producto, vuelva a intentarlo.')
      },
    })
  }

  editProduct(item: FinancialProduct){
    this.router.navigate(['/editar-producto'], {queryParams: { form: JSON.stringify(item) }});
  }

  openDialogAlert(title: string, callback?: () => void){
    const dialogRef = this.dialog.open(AlertComponent, {
      restoreFocus: false,
      disableClose: true,
      data: {title}
    });
    dialogRef.afterClosed().subscribe({
      next: (_)=>{
        this.ngZone.run(()=>{
          if (callback) {
            callback();
          }
        })
      }
    });
  }

}
