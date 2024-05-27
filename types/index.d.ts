type SocketMessage = {
  msg: string;
  rank?: number;
  success?: boolean;
  output?: {
    error?: string;
    data?: string[][];
  };
  avg_event_process_time?: number;
  queue_size?: number;
};

interface ImageBatch {
  fingerprint: number;
  prompt: string;
  timestamp: number;
  batch: string[];
}
