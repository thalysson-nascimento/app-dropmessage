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
        },
        {
          id: '9b74c9897bac770ffc029102a200c5de',
          image:
            'https://m.media-amazon.com/images/S/pv-target-images/334f00b53cf3ef848ea7048b25711bc98e8236ce1685a096990c80d0965835ea.png',
          expirationTimer: 'dragon ball z',
          typeExpirationTimer: '',
        },
        {
          id: '6dcd4ce23d88e2ee9568ba546c007c63',
          image: 'https://jpimg.com.br/uploads/2019/04/thanos-vingadores.jpg',
          expirationTimer: 'vingadores',
          typeExpirationTimer: '',
        },
      ],
    };

    // Retornando a resposta diretamente sem fazer a requisição HTTP
    return of(mockResponse).pipe(delay(1000));
  }
}
