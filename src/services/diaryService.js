import { supabase } from './supabase';

export const getDiaryEntries = async () => {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createDiaryEntry = async (entry) => {
  const { data, error } = await supabase
    .from('diary_entries')
    .insert([entry])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateDiaryEntry = async (id, updates) => {
  const { data, error } = await supabase
    .from('diary_entries')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteDiaryEntry = async (id) => {
  const { error } = await supabase
    .from('diary_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 