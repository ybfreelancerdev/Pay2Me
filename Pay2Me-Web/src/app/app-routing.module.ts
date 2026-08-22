import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/app', pathMatch: 'full'},
  {path: 'app', loadChildren: () => import('./screens/screens.module').then(m => m.ScreensModule)},
  {path: '**', loadChildren: () => import('./screens/not-found/not-found.module').then(n => n.NotFoundModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
