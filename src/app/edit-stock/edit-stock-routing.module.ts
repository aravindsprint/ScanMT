import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditStockPage } from './edit-stock.page';

const routes: Routes = [
  {
    path: '',
    component: EditStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditStockPageRoutingModule {}
