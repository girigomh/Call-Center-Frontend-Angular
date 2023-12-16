import {User} from './user';
import {News} from './news';

export class Usernews {
  constructor(
    public id: number,
    public user: User,
    public news: News
  ) {}
}
