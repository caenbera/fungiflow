export interface ChecklistItem {
  id: number;
  title: string;
  objective?: string;
  description?: string;
  recurrence?: string;
  completed: boolean;
}

export interface ChecklistSection {
  id: number;
  title: string;
  phase?: 'inicial' | 'continua';
  items: ChecklistItem[];
}
