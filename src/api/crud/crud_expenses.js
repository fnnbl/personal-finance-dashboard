import { supabase } from "../../auth/supabaseClient";

// Alle Ausgaben zu einem FinanceCheck laden
export async function getExpensesByFinanceCheck(financeCheckId) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("check_id", financeCheckId); // <-- angepasst

  if (error) throw error;
  return data;
}

// Einzelne Ausgabe anlegen
export async function createExpense({
  finance_check_id, // bleibt im Input-Objekt
  category_id, // id einer Kategorie (siehe DB)
  description,
  amount,
  interval,
  note,
}) {
  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        check_id: finance_check_id, // <-- Mapping!
        category: category_id, // <-- Mapping auf Spalte "category"
        description,
        amount,
        interval,
        note,
      },
    ])
    .single();

  if (error) throw error;
  return data;
}

// Einzelne Ausgabe updaten
export async function updateExpense(id, updates) {
  const { data, error } = await supabase
    .from("expenses")
    .update(updates)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Einzelne Ausgabe löschen
export async function deleteExpense(id) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function getExpenseSumByFinanceCheck(checkId) {
  const { data, error } = await supabase
    .from("expenses_sum_by_check")
    .select("sum")
    .eq("check_id", checkId)
    .single();
  if (error) throw error;
  return data?.sum ?? 0;
}
