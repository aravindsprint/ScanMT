import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ColorPageRoutingModule } from './color-routing.module';

import { ColorPage } from './color.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    ColorPageRoutingModule
  ],
  declarations: [ColorPage]
})
export class ColorPageModule {}
