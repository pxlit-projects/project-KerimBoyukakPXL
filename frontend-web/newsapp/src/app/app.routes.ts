import { Routes } from '@angular/router';
import {LoginComponent} from "./core/login/login.component";
import {DashboardComponent} from "./core/dashboard/dashboard.component";

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];
