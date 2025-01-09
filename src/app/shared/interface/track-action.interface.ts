export interface TrackAction {
  pageView: string;
  event: string;
  label?: string;
  category: string;
  message: string;
  statusCode: number;
  level: 'info' | 'warn' | 'error' | 'debug' | 'verbose';
}
