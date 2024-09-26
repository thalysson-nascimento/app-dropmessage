import { HttpHeaders } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { PostList } from '../../interface/post';
import { PostBase } from './post.base';

export class PostMock extends PostBase {
  private apiUrl = `/pix`;

  listPost(): Observable<PostList> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer mock-token',
    });

    const mockResponse: PostList = {
      posts: [
        {
          id: 'game-of-throne-aaaa',
          path: 'https://br.web.img3.acsta.net/pictures/19/03/21/16/15/4239577.jpg',
          name: 'praia',
        },
        {
          id: 'dragon-ball-bbbb',
          path: 'https://m.media-amazon.com/images/S/pv-target-images/334f00b53cf3ef848ea7048b25711bc98e8236ce1685a096990c80d0965835ea.png',
          name: 'gato',
        },
        {
          id: 'thanos-cccc',
          path: 'https://jpimg.com.br/uploads/2019/04/thanos-vingadores.jpg',
          name: 'praia',
        },
        {
          id: 'homem-de-ferro-dddd',
          path: 'https://disneyplusbrasil.com.br/wp-content/uploads/2022/10/Tony-Stark-Homem-de-Ferro.jpg',
          name: 'gato',
        },
        {
          id: 'homem-aranha-eeee',
          path: 'https://cienciahoje.org.br/wp-content/uploads/2018/11/legiao_vpZw6kWY8GuK9cqCh5DJEFafL437IyAz02smlNgRoO.png.jpeg',
          name: 'gato',
        },
      ],
    };

    return this.httpClient
      .get<PostList>(this.apiUrl, { headers })
      .pipe(mergeMap(() => of(mockResponse)));
  }
}
