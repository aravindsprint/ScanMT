import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommnamePage } from './commname.page';

const routes: Routes = [
  {
    path: '',
    component: CommnamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommnamePageRoutingModule {}
