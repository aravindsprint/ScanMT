import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { AuthGuard } from './guard/auth.guard';





const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  { path: 'landing', loadChildren: './landing/landing.module#LandingPageModule' },  
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  
  //{
    //path: 'folder/:id',
    //loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  //},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'commname',
    loadChildren: () => import('./commname/commname.module').then( m => m.CommnamePageModule)
  },
  {
    path: 'color/:id',
    loadChildren: () => import('./color/color.module').then( m => m.ColorPageModule)
  },
  {
    path: 'item/:id/:comm_name',
    loadChildren: () => import('./item/item.module').then( m => m.ItemPageModule)
  },
  {
    path: 'stockdetails',
   loadChildren: () => import('./stock/stock.module').then( m => m.StockPageModule)
  },
  //{
    //path: 'stock/:id/:color_name/:comm_name',
    //loadChildren: () => import('./stock/stock.module').then( m => m.StockPageModule)
  //},
  {
    path: 'bookmark',
    loadChildren: () => import('./bookmark/bookmark.module').then( m => m.BookmarkPageModule)
  },
  {
    path: 'stock-entry',
    loadChildren: () => import('./stock-entry/stock-entry.module').then( m => m.StockEntryPageModule)
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
     
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
