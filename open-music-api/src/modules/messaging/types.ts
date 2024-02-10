export interface MessagingService {
  send(name: string, message: any): Promise<void>;
}
