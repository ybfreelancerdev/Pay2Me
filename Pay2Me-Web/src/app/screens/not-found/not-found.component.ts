import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppModuleInterface } from 'src/app/utils/app-module-interface';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  appModuleInterface = AppModuleInterface;

  constructor(public router : Router) { }

  ngOnInit(): void {
  }

}
