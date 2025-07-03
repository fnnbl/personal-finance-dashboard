import { supabase } from "../../auth/supabaseClient";

// Alle Kategorien laden
export async function getExpenseCategories() {
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .order("id");
  if (error) throw error;
  return data;
}
