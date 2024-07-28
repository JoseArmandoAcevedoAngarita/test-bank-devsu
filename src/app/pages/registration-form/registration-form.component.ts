import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinancialProductsService } from '../../services/financial-products.service';
import { CreateFinancialProductDTO, FinancialProduct } from '../../models/financial-products.model';

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { addYears, format, parse } from "date-fns";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { filter, map, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../components/dialog/alert/alert.component';

export function IDCheck(api: any): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (api && api.IDCheck) {
      const result = api.IDCheck(control.value);
      if (result && typeof result.pipe === 'function') {
        return result.pipe(
          map((result) => (result ? { idExists: true } : null))
        );
      } else {
        console.error('api.IDCheck does not return an observable');
        return of(null);
      }
    } else {
      console.error('api.IDCheck is not defined');
      return of(null);
    }
  };
}

@Component({
  selector: 'app-registration-form',
  standalone: true,
  providers: [provideNativeDateAdapter(), provideNgxMask()],
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    ReactiveFormsModule,
    NgxMaskDirective,   
    NgxMaskPipe,
    RouterModule
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent implements OnInit, OnDestroy {

  form: FormGroup = this.formBuilder.group({});

  today = new Date();

  state: string | null = null;

  readonly dialog = inject(MatDialog);

  createFinancialProduct!: Subscription;

  get id() {return this.form.get('id') as FormControl};
  get name() {return this.form.get('name') as FormControl};
  get description() {return this.form.get('description') as FormControl};
  get logo() {return this.form.get('logo') as FormControl};
  get releaseDate() {return this.form.get('releaseDate') as FormControl};
  get reviewDate() {return this.form.get('reviewDate') as FormControl};

  get idErrors() {return this.form.get('id')?.errors || {}}
  get nameErrors() {return this.form.get('name')?.errors || {}}
  get descriptionErrors() {return this.form.get('description')?.errors || {}}
  get logoErrors() {return this.form.get('logo')?.errors || {}}
  get releaseDateErrors() {return this.form.get('releaseDate')?.errors || {}}

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public ngZone: NgZone,
    public financialProductsService: FinancialProductsService
  ){
    this.form = this.formBuilder.group({
      id: ['', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)], asyncValidators: [IDCheck(this.financialProductsService)], updateOn: 'blur' }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      releaseDate: ['', [Validators.required]],
      reviewDate: [{value: '', disabled: true}, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.state = this.activatedRoute.snapshot.data['state'];

    if(this.state === 'edit'){  
      const {id, name, logo, date_release, description}: FinancialProduct = JSON.parse(this.activatedRoute.snapshot.queryParams['form']);
      const parseDate = parse(date_release, 'yyyy-MM-dd', new Date());
      this.form.patchValue({
        id: id,
        name: name,
        description: description,
        logo: logo,
        releaseDate: parseDate,
        reviewDate: addYears(parseDate, 1)
      });
      this.form.get('id')?.disable();
    }

    this.releaseDate.valueChanges
    .pipe(
      filter((value)=> value)
    )
    .subscribe((value: Date) => {
      const reviewDateValue = addYears(value, 1);
      this.reviewDate.setValue(reviewDateValue);
    });
  }

  ngOnDestroy(): void {
    this.createFinancialProduct?.unsubscribe();
  }

  prepareForm() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
    });
  
    if (this.form.invalid) {
      return false;
    }
  
    this.form.disable();
    return true;
  }
  
  getFormData(): CreateFinancialProductDTO {
    const formValues = this.form.getRawValue();
  
    return {
      id: formValues.id,
      name: formValues.name,
      description: formValues.description,
      logo: formValues.logo,
      date_release: format(formValues.releaseDate, 'yyyy-MM-dd'),
      date_revision: format(formValues.reviewDate, 'yyyy-MM-dd')
    };
  }
  
  handleResponse(message: string) {
    this.openDialog(message, () => {
      this.router.navigate(['/']);
    });
  }
  
  handleError() {
    this.form.enable();
    this.resetForm();
    this.openDialog('Ha ocurrido un error, vuelva a intentarlo.')
  }
  
  saveForm() {
    if (!this.prepareForm()) {
      return;
    }
  
    const data = this.getFormData();
  
    this.createFinancialProduct = this.financialProductsService.createFinancialProduct(data)
      .subscribe({
        next: () => {
          this.handleResponse('Se ha creado satisfactoriamente el producto');
        },
        error: (error) => {
          this.handleError();
        }
      });
  }
  
  updateForm() {
    if (!this.prepareForm()) {
      return;
    }
  
    const data = this.getFormData();
  
    this.createFinancialProduct = this.financialProductsService.updateFinancialProduct(data)
      .subscribe({
        next: () => {
          this.handleResponse('Se ha actualizado satisfactoriamente el producto');
        },
        error: (error) => {
          this.handleError();
        }
      });
  }
  

  resetForm(){
    this.form.reset();
  }

  openDialog(title: string, callback?: () => void) {
    const dialogRef = this.dialog.open(AlertComponent, {
      restoreFocus: false,
      data: {
        title: title
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngZone.run(()=>{
        if (callback) {
          callback();
        }
      })
    });
  }
}


