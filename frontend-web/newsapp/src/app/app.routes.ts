import { Routes } from '@angular/router';
import {LoginComponent} from "./core/login/login.component";
import {DashboardComponent} from "./core/dashboard/dashboard.component";
import {UserDashboardComponent} from "./core/user-dashboard/user-dashboard.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {AddPostComponent} from "./core/posts/add-post/add-post.component";
import {EditDraftComponent} from "./core/posts/edit-draft/edit-draft.component";
import {EditPostComponent} from "./core/posts/edit-post/edit-post.component";
import {confirmLeaveGuard} from "./shared/guards/confirm-leave.guard";
import {PostReviewComponent} from "./core/reviews/post-review/post-review.component";
import {PostDetailComponent} from "./core/posts/post-detail/post-detail.component";
import {EditRejectedComponent} from "./core/posts/edit-rejected/edit-rejected.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { role: 'editor' }},
  {path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard], data: { role: 'user' }},
  {path: 'add-post', component: AddPostComponent, canActivate: [AuthGuard], data: { role: 'editor' }, canDeactivate: [confirmLeaveGuard]},
  {path: 'post-detail/:id', component: PostDetailComponent, canActivate: [AuthGuard], data: { role: 'user' }},
  {path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthGuard], data: { role: 'editor' }},
  {path: 'review-post/:id', component: PostReviewComponent, canActivate: [AuthGuard], data: { role: 'editor' }},
  {path: 'edit-draft/:id', component: EditDraftComponent, canActivate: [AuthGuard], data: { role: 'editor' }},
  {path: 'edit-rejected/:id', component: EditRejectedComponent, canActivate: [AuthGuard], data: { role: 'editor' }},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login'}
];
