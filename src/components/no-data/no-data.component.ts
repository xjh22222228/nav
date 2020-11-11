import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goBack = () => {
    history.go(-1);
  }
}
