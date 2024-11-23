export class Post {
  id?: number;
  title: string;
  content: string;
  author: string;
  dateCreated: Date;
  state: string;

  constructor(title: string, content: string, author: string, dateCreated: Date, state: string) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.dateCreated = dateCreated;
    this.state = state;
  }
}
