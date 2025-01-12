import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Post} from "../models/post.model";
import {FilterModel} from "../models/filter.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  api:string = environment.apiUrl+'post/api/posts';
  http:HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  private getRole(): string {
    return this.authService.getRole() || '';
  }

  getCreatedPosts() : Observable<Post[]> {
    return this.http.get<Post[]>(this.api, {headers : {'role': this.getRole()}});
  }
  getConceptPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/concept', {headers : {'role': this.getRole()}});
  }
  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/published', {headers : {'role': this.getRole()}});
  }
  getRejectedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api+'/rejected', {headers : {'role': this.getRole()}});
  }
  getPost(id:number) : Observable<Post> {
    return this.http.get<Post>(this.api+'/'+id, {headers : {'role': this.getRole()}});
  }
  createPost(post: any) : Observable<Post>{
    return this.http.post<Post>(this.api, post, {headers : {'role': this.getRole()}});
  }
  saveConcept(post: any):Observable<Post> {
    return this.http.post<Post>(this.api+'/concept', post, {headers : {'role': this.getRole()}});
  }
  updatePost(id:number, post: any):Observable<Post>{
    return this.http.put<Post>(this.api+'/'+id, post, {headers : {'role': this.getRole()}});
  }
  updateConcept(id:number, post:any):Observable<Post>{
    return this.http.put<Post>(this.api+'/concept/'+id, post, {headers : {'role': this.getRole()}});
  }
  updateRejected(id:number, post:any):Observable<Post>{
    return this.http.put<Post>(this.api+'/rejected/'+id, post, {headers : {'role': this.getRole()}});
  }
  filterPosts(filter: FilterModel) : Observable<Post[]> {
    return this.http.get<Post[]>(this.api + '/published', {headers : {'role': this.getRole()}}).pipe(
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
