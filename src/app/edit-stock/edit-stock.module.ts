import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditStockPageRoutingModule } from './edit-stock-routing.module';

import { EditStockPage } from './edit-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditStockPageRoutingModule
  ],
  declarations: [EditStockPage]
})
export class EditStockPageModule {}
