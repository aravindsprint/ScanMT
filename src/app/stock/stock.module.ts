import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockPageRoutingModule } from './stock-routing.module';

import { StockPage } from './stock.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2CompleterModule } from 'ng2-completer';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { IonicSelectableModule } from 'ionic-selectable';

import { ModalComponent } from '../modal/modal.component';






@NgModule({
  imports: [
    CommonModule,
    AutoCompleteModule,
    IonicSelectableModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    Ng2CompleterModule,
    StockPageRoutingModule
  ],
  declarations: [StockPage, ModalComponent],
  exports: [ModalComponent],
  entryComponents: [ModalComponent]
})
export class StockPageModule {}
