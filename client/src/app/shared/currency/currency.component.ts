import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit, OnChanges {

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  @Input('control') public currencyControl: AbstractControl = new UntypedFormControl();
  @Input('form') public form: UntypedFormGroup;

  public ngOnInit(): void {
  }
}
