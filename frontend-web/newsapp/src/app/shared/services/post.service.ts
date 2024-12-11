import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Post} from "../models/post.model";
import {FilterModel} from "../models/filter.model";

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
  getRejectedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/rejected');
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

  filterPosts(filter: FilterModel) : Observable<Post[]> {
    return this.http.get<Post[]>(this.api + '/published').pipe(
      map((posts: Post[]) => posts.filter(post => this.isPostMatchingFilter(post, filter)))
    );
  }
  private isPostMatchingFilter(post: any, filter: FilterModel): boolean {
    const matchesContent = post.content?.toLowerCase().includes(filter.content.toLowerCase()) ?? false;
    const matchesAuthor = post.author?.toLowerCase().includes(filter.author.toLowerCase()) ?? false;
    const matchesDateCreated = !filter.dateCreated || new Date(post.dateCreated).toDateString() === new Date(filter.dateCreated).toDateString();

    return matchesContent && matchesAuthor && matchesDateCreated;
  }
}
