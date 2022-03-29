import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockEntryPage } from './stock-entry.page';

const routes: Routes = [
  {
    path: '',
    component: StockEntryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockEntryPageRoutingModule {}
