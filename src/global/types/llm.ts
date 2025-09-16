export interface LlmMessageStreamResponse {
  done: boolean;
  response: string;
  error?: string;
}

export interface LlmDownloadStreamResponse {
  done: boolean;
  progress: number; // 0-100
  error?: string;
}
