import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/servicesLogin/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'messenger',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'inscription',
    loadChildren: () => import('./pages/inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'messenger',
    loadChildren: () => import('./pages/messenger/messenger.module').then( m => m.MessengerPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'chats/:id',
    loadChildren: () => import('./pages/chats/chats.module').then( m => m.ChatsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/profil.module').then( m => m.ProfilPageModule),
    canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
