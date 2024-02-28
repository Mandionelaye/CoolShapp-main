import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessengerPageRoutingModule } from './messenger-routing.module';

import { MessengerPage } from './messenger.page';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { ConversationComponent } from 'src/app/components/conversation/conversation.component';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessengerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MessengerPage, UserListComponent, ConversationComponent, TabBarComponent]
})
export class MessengerPageModule {}
