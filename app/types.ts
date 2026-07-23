
import { UIMessage } from "ai";

export interface Source {
  id: string;
  title: string;
  url?: string;
  section?: string;
}

export interface ChatMessageMetadata {
  sources?: Source[];
  createdAt?: number;
  model?: string;
}

export type ChatMessage = UIMessage<ChatMessageMetadata>;