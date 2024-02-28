import { AfterViewInit, Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { CoolServiceService } from 'src/app/services/cool-service.service';
import {io} from "socket.io-client";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent  implements OnInit {
  @Input() filtMessage:number;
  constructor(
    private route:Router
  ){}
  ngOnInit() {
  }
}
