import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  api: string = environment.apiUrl+'/api/posts';
  http: HttpClient = inject(HttpClient);

  getCreatedPosts() : Observable<Post[]> {
    return this.http.get<Post[]>(this.api);
  }
  getConceptPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/concept');
  }
  getPost(id:number) : Observable<Post> {
    return this.http.get<Post>(this.api+'/'+id);
  }
  createPost(post: Post) : Observable<Post>{
    return this.http.post<Post>(this.api, post);
  }
  saveConcept(post: Post):Observable<Post> {
    return this.http.post<Post>(this.api+'/concept', post);
  }
  updateContent(id:number, content:string):Observable<Post>{
    return this.http.put<Post>(this.api+'/'+id, content);
  }
  updateConcept(id:number, post:Post):Observable<Post>{
    return this.http.put<Post>(this.api+'/concept/'+id, post);
  }
}
