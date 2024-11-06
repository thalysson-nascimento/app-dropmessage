import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { Post } from '../../../shared/interface/post';
import { SocketAddNewPostMessageService } from '../../../shared/service/socketAddNewPostMessage/socket-add-new-post-message.service';
import { SocketRemovePostMessageService } from '../../../shared/service/socketRemovePostMessage/socket-remove-post-message.service';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.scss'],
  standalone: true,
  imports: [CommonModule, ModalComponent],
})
export class TesteComponent implements OnInit, OnDestroy {
  posts: Post[] = []; // Variável que armazenará os dados recebidos
  socketSubscription!: Subscription;
  expirationSubscription!: Subscription;
  @ViewChild('dialog') dialog!: ModalComponent;

  constructor(
    private socketAddNewPostMessageService: SocketAddNewPostMessageService,
    private socketRemovePostMessageService: SocketRemovePostMessageService,
    private cdRef: ChangeDetectorRef
  ) {}

  openDialog() {
    this.dialog.openDialog();
  }

  ngOnInit(): void {
    this.addNewSocketPostMessage();
    this.removeSocketPostMessage();
  }

  addNewSocketPostMessage() {
    this.posts;
    this.socketSubscription = this.socketAddNewPostMessageService
      .onNewPostMessage()
      .subscribe({
        next: (data) => {
          console.log(data);
          this.posts.push(data);
          this.cdRef.detectChanges();
          // this.posts = [...this.posts, data];
        },
        error: (err) => console.error('Erro ao receber post:', err),
      });
  }

  removeSocketPostMessage() {
    this.expirationSubscription = this.socketRemovePostMessageService
      .onPostExpired()
      .subscribe({
        next: (expiredPostId: string) => {
          console.log('removendo port com o ID: ', expiredPostId);
          this.posts = this.posts.filter(
            (post: Post) => post.id !== expiredPostId
          );
          this.cdRef.detectChanges(); // Força atualização
        },
        error: (err) => console.error('Erro ao remover post:', err),
      });
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    if (this.expirationSubscription) {
      this.expirationSubscription.unsubscribe();
    }
  }
}
