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
      ],
    };

    // Retornando a resposta diretamente sem fazer a requisição HTTP
    return of(mockResponse).pipe(delay(5000));
  }
}
