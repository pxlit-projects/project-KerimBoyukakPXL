import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Comment} from "../models/comment.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  api:string = environment.apiUrl+'comment/api/comments';
  http:HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  private getRole(): string {
    return this.authService.getRole() || '';
  }

  getCommentsByPostId(postId: number | undefined) : Observable<Comment[]> {
    return this.http.get<Comment[]>(this.api + "/" + postId, {headers : {'role': this.getRole()}});
  }

  createComment(comment: any) : Observable<Comment>{
    return this.http.post<Comment>(this.api, comment, {headers : {'role': this.getRole()}});
  }

  updateComment(id: number | undefined, comment: any):Observable<Comment>{
    return this.http.put<Comment>(this.api+'/'+id, comment, {headers : {'role': this.getRole()}});
  }

  deleteComment(id: number | undefined):Observable<void>{
    return this.http.delete<void>(this.api+'/'+id, {headers : {'role': this.getRole()}});
  }
}
