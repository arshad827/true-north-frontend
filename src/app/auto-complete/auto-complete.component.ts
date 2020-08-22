import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AppService } from '../app-service.service';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { NgZone } from '@angular/core';
/* Imports */
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit, OnDestroy {

  constructor(private service: AppService, private zone: NgZone) { }
  form: FormGroup;
  options: string[] = [];

  public filteredOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  selected: Array<[]> = [];

  private chart: am4charts.XYChart;

  ngOnInit(): void {
    this.service.search('name').subscribe(res => { });
    this.form = new FormGroup({
      myControl: new FormControl(),
      myControlsearch: new FormControl()
    });
    this.filteredOptions.next(this.options.slice());

    // listen for search field value changes
    this.form.controls['myControlsearch'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
    this.form.controls['myControl'].setValue([2, 3, 3])
  }

  // filter function÷
  filterBanksMulti() {
    if (!this.options) {
      return;
    }

    // get the search keyword
    let search = this.form.controls['myControlsearch'].value;
    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
      this.service.search(search).subscribe(res => {
        console.log(res.response, res.results);

        if (res.response === 'success') {
          this.filteredOptions.next(res.results);
        }
      });

    }
  }
  onselect(e): void {

    console.log(e)
    this.selected.push(e);
    this.selected.forEach(element => {
      this.form.controls['myControl'].setValue([element]);
    });

  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
