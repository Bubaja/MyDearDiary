import { supabase } from '../lib/supabase';
import { DiaryEntry, CreateDiaryEntry, UpdateDiaryEntry } from '../types/diary';

const DIARY_TABLE = 'diary_entries';

export const diaryService = {
  // Dobavi sve unose za trenutnog korisnika
  async getAllEntries(): Promise<DiaryEntry[]> {
    const { data: entries, error } = await supabase
      .from(DIARY_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return entries;
  },

  // Dobavi jedan unos po ID-u
  async getEntryById(id: string): Promise<DiaryEntry | null> {
    const { data: entry, error } = await supabase
      .from(DIARY_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return entry;
  },

  // Kreiraj novi unos
  async createEntry(entry: CreateDiaryEntry): Promise<DiaryEntry> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Korisnik nije prijavljen');
    }

    const { data, error } = await supabase
      .from(DIARY_TABLE)
      .insert([{ ...entry, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Ažuriraj postojeći unos
  async updateEntry(id: string, entry: UpdateDiaryEntry): Promise<DiaryEntry> {
    const { data, error } = await supabase
      .from(DIARY_TABLE)
      .update(entry)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Obriši unos
  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from(DIARY_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}; 