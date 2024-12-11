import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Comment} from "../models/comment.model";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  api:string = environment.apiUrl+'comment/api/comments';
  http:HttpClient = inject(HttpClient);

  getCommentsByPostId(postId: number | undefined) : Observable<Comment[]> {
    return this.http.get<Comment[]>(this.api + "/" + postId);
  }

  createComment(comment: any) : Observable<Comment>{
    return this.http.post<Comment>(this.api, comment);
  }

  updateComment(id: number | undefined, comment: any):Observable<Comment>{
    return this.http.put<Comment>(this.api+'/'+id, comment);
  }

  deleteComment(id: number | undefined):Observable<void>{
    return this.http.delete<void>(this.api+'/'+id);
  }
}
