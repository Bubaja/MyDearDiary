export interface DiaryEntry {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type CreateDiaryEntry = Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateDiaryEntry = Partial<CreateDiaryEntry>; 