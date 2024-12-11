import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Review} from "../models/review.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  api:string = environment.apiUrl+'review/api/reviews';
  http:HttpClient = inject(HttpClient);

  getReview(postId: number | undefined) : Observable<Review> {
    return  this.http.get<Review>(this.api+'/'+postId);
  }

  approvePost(postId: number, reviewer: string | null) {
    return this.http.post(this.api+'/approve/'+postId, {reviewer});
  }

  rejectPost(postId: number, reviewer: string | null, rejectMessage: string) {
    const reviewRequest = { postId, reviewer, rejectMessage };
    return this.http.post(this.api + '/reject/' + postId, reviewRequest);
  }
}
