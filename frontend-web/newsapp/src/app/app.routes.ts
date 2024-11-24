import { Routes } from '@angular/router';
import {LoginComponent} from "./core/login/login.component";
import {DashboardComponent} from "./core/dashboard/dashboard.component";
import {UserDashboardComponent} from "./core/user-dashboard/user-dashboard.component";
import {AuthGuard} from "./auth.guard";
import {AddPostComponent} from "./core/posts/add-post/add-post.component";
import {EditDraftComponent} from "./core/posts/edit-draft/edit-draft.component";
import {EditPostComponent} from "./core/posts/edit-post/edit-post.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard]},
  {path: 'add-post', component: AddPostComponent, canActivate: [AuthGuard]},
  {path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthGuard]},
  {path: 'edit-draft/:id', component: EditDraftComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login'}
];
