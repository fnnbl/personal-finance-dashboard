import { supabase } from "../../auth/supabaseClient";

// Alle Finance-Checks eines Users laden
export async function getFinanceChecksByUser(userId) {
  const { data, error } = await supabase
    .from("finance_checks")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

// Einen neuen Finance-Check anlegen
export async function createFinanceCheck({ name }) {
  // Hole die User-ID vom aktuellen Supabase User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("finance_checks")
    .insert([{ user_id: user.id, name }])
    .single();
  if (error) throw error;
  return data;
}

// Einzelnen Finance-Check (optional)
export async function getFinanceCheckById(id) {
  const { data, error } = await supabase
    .from("finance_checks")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
