export interface ChatMessageUI {
  id: string;
  content?: string;
  imageUrl?: string;

  time: string;
  dateLabel: string;

  isOwnMessage: boolean;

  showDateLabel?: boolean;
}
