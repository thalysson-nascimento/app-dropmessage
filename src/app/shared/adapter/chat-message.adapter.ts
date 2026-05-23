import { ChatMessageUI } from '../interface/chat-message-ui.interface';
import { ChatMessageApi } from '../interface/chat-message.interface';

export class ChatMessageAdapter {
  static fromApi(messages: ChatMessageApi[]): ChatMessageUI[] {
    let lastDate = '';

    return messages.map((msg) => {
      const showDateLabel = msg.dateLabel !== lastDate;
      lastDate = msg.dateLabel;

      return {
        id: msg.id,
        content: msg.content,
        time: msg.time,
        dateLabel: msg.dateLabel,
        isOwnMessage: msg.isOwnMessage,
        showDateLabel,
      };
    });
  }

  static fromSocket(message: any, currentUserHash: string): ChatMessageUI {
    const isOwn = message.user.userHashPublic === currentUserHash;

    return {
      id: message.id,
      content: message.content,
      time: new Date(message.createdAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      dateLabel: new Date(message.createdAt).toLocaleDateString('pt-BR'),
      isOwnMessage: isOwn,
      showDateLabel: false,
    };
  }
}
