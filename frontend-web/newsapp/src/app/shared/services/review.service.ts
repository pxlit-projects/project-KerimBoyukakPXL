import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Review} from "../models/review.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  api:string = environment.apiUrl+'review/api/reviews';
  http:HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  private getRole(): string {
    return this.authService.getRole() || '';
  }

  getReview(postId: number | undefined) : Observable<Review> {
    return  this.http.get<Review>(this.api+'/'+postId, {headers : {'role': this.getRole()}});
  }

  approvePost(postId: number, reviewer: string | null) {
    return this.http.post(this.api+'/approve/'+postId, {reviewer}, {headers : {'role': this.getRole()}});
  }

  rejectPost(postId: number, reviewer: string | null, rejectMessage: string) {
    const reviewRequest = { postId, reviewer, rejectMessage };
    return this.http.post(this.api + '/reject/' + postId, reviewRequest, {headers : {'role': this.getRole()}});
  }
}
