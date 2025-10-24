export enum Stage {
  Welcome,
  ValidatorPath,
  ExplorerPath,
  Workspace,
}

export interface Opportunity {
  title: string;
  details: string;
  existingSolutions: string[];
}

export interface Market {
  name:string;
  opportunities: Opportunity[];
  currentSize: string;
  futureEvaluation: string;
}

export interface MarketNode {
  name: string;
  probability: number;
  details?: string;
  children?: MarketNode[];
}

export enum MessageSender {
    User = 'user',
    AI = 'ai',
}

export interface ChatMessage {
    sender: MessageSender;
    text: string;
}
