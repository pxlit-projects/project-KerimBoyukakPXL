export class Review {
  id?: number;
  postId: string;
  reviewer: string;
  rejectMessage: string;


 constructor(postId: string, reviewer: string, rejectMessage: string) {
    this.postId = postId;
    this.reviewer = reviewer;
    this.rejectMessage = rejectMessage
 }
}
