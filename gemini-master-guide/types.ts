
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}
