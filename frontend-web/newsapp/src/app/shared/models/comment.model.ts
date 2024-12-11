export class Comment {
  id?: number;
  postId: number;
  commenter: string;
  content: string;


  constructor(postId: number, commenter: string, content: string) {
    this.postId = postId;
    this.commenter = commenter;
    this.content = content;
  }
}
