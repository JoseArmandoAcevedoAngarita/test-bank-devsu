import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { FinancialProduct } from '../../../models/financial-products.model';

interface DialogData extends FinancialProduct{}

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<ConfirmComponent>,

  ) {}

  deleteProduct(){
    this.dialogRef.close({delete: true});
  }

}
