import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommnamePageRoutingModule } from './commname-routing.module';

import { CommnamePage } from './commname.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CommnamePageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [CommnamePage]
})
export class CommnamePageModule {}
