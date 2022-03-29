import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockEntryPageRoutingModule } from './stock-entry-routing.module';

import { StockEntryPage } from './stock-entry.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2CompleterModule } from 'ng2-completer';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockEntryPageRoutingModule,
    Ng2SearchPipeModule,
    Ng2CompleterModule,
    AutoCompleteModule

  ],
  declarations: [StockEntryPage]
})
export class StockEntryPageModule {}
