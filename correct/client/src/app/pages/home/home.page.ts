import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as aos from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  imageAnimation=false;
  
  constructor() { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.imageAnimation = true;
  }
}
