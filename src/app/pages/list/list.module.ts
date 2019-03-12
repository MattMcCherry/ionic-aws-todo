import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPage } from './list.page';
import { ListItemModal } from 'src/app/shared/components/list-item-modal/list-item-modal.component';
import { AmplifyService } from 'aws-amplify-angular';

const routes: Routes = [
  {
    path: '',
    component: ListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListPage, ListItemModal],
  entryComponents: [ListItemModal],
  providers: [AmplifyService],
})
export class ListPageModule { }
