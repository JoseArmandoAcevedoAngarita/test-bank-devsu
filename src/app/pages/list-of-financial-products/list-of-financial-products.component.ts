import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/dialog/confirm/confirm.component';
import { FinancialProductsService } from '../../services/financial-products.service';
import { asyncScheduler, Subscription, tap, throttleTime } from 'rxjs';
import { FinancialProduct } from '../../models/financial-products.model';
import { AlertComponent } from '../../components/dialog/alert/alert.component';
import { AsyncPipe } from '@angular/common';
import { FilterAndPaginatePipe } from '../../pipes/filter-and-paginate.pipe';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

type RequestStatus = 'init' | 'success' | 'failed' | 'loading';

@Component({
  selector: 'app-list-of-financial-products',
  standalone: true,
  imports: [RouterModule, MatMenuModule, AsyncPipe, FilterAndPaginatePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './list-of-financial-products.component.html',
  styleUrl: './list-of-financial-products.component.scss'
})
export class ListOfFinancialProductsComponent implements OnInit, OnDestroy {

  status: RequestStatus = 'init';

  filterControl = new FormControl<string>('');

  filter: string = '';
  pageSize: number = 5;
  pageIndex: number = 1;
  totalPages: number = 0;

  financialProducts: FinancialProduct[] = [];
  
  readonly dialog = inject(MatDialog);

  filterAndPaginatePipe = new FilterAndPaginatePipe();

  getFinancialProductsSubscription!: Subscription;
  deleteFinancialProductsSubscription!: Subscription;

  constructor(
    private financialProductsService: FinancialProductsService,
    private ngZone: NgZone,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.getFinancialProducts();

    this.filterControl.valueChanges
    .pipe(
      throttleTime(300, asyncScheduler, {leading: true, trailing: true}),
      tap((value)=> {
        this.filter = value? value: '';
        this.updateTotalPages();
      })
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this.getFinancialProductsSubscription?.unsubscribe();
  }

  getFinancialProducts(){
    this.status = 'loading';
    this.getFinancialProductsSubscription = this.financialProductsService.getFinancialProducts().subscribe({
      next: ({data})=>{
        this.financialProducts = data;
        this.updateTotalPages();
        this.status = 'success';
      },
      error: ()=>{
        this.status = 'failed';
        this.openDialogAlert('Ha ocurrido un error al cargar los datos, vuelva a intentarlo.')
      }
    })
  }

  // Edit Produt

  editProduct(item: FinancialProduct){
    this.router.navigate(['/editar-producto'], {queryParams: { form: JSON.stringify(item) }});
  }

  // Delete Produt

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

  // Pagination

  onPageSizeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = +selectElement.value;
    this.pageIndex = 1; 
    this.updateTotalPages();
  }

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
  }

  updateTotalPages() {
    const filteredItems = this.filterAndPaginatePipe.filterItems(this.financialProducts, this.filter);
    this.totalPages = Math.ceil(filteredItems.length / this.pageSize);
  }

  getPages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  nextPage(){
    if(this.pageIndex < this.totalPages){
      this.pageIndex += 1;
    }
  }
  prevPage(){
    if(this.pageIndex > 1){
      this.pageIndex -= 1;
    }
  }

}
