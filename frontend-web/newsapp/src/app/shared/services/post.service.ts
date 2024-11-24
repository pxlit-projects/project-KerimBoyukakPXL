import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  api:string = environment.apiUrl+'post/api/posts';
  http:HttpClient = inject(HttpClient);

  getCreatedPosts() : Observable<Post[]> {
    return this.http.get<Post[]>(this.api);
  }
  getConceptPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/concept');
  }
  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/published');
  }
  getPost(id:number) : Observable<Post> {
    return this.http.get<Post>(this.api+'/'+id);
  }
  createPost(post: any) : Observable<Post>{
    return this.http.post<Post>(this.api, post);
  }
  saveConcept(post: any):Observable<Post> {
    return this.http.post<Post>(this.api+'/concept', post);
  }
  updatePost(id:number, post: any):Observable<Post>{
    return this.http.put<Post>(this.api+'/'+id, post);
  }
  updateConcept(id:number, post:any):Observable<Post>{
    return this.http.put<Post>(this.api+'/concept/'+id, post);
  }
}
