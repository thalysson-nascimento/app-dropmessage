import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PostList } from '../../interface/post';
import { PostBase } from './post.base';

@Injectable({
  providedIn: 'root',
})
export class PostMock extends PostBase {
  constructor(httpClient: HttpClient) {
    super(httpClient); // Chamando o construtor da classe base
  }

  listPost(): Observable<PostList> {
    // Simulando a resposta mockada
    const mockResponse: PostList = {
      currentPage: 1,
      totalPages: 3,
      perPage: 4,
      totalItems: 12,
      data: [
        {
          id: '1a79a4d60de6718e8e5b326e338ae533',
          image:
            'https://br.web.img3.acsta.net/pictures/19/03/21/16/15/4239577.jpg',
          expirationTimer: 'game of thrones',
          typeExpirationTimer: '',
          user: {
            name: 'Jon Snow',
            avatar: {
              image: 'https://i.pravatar.cc/300?img=1',
            },
            UserLocation: {
              city: 'Winterfell',
              stateCode: 'Westeros',
            },
          },
        },
      ],
    };

    // Retornando a resposta diretamente sem fazer a requisição HTTP
    return of(mockResponse).pipe(delay(1000));
  }
}
