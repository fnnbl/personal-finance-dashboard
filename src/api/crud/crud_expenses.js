import { supabase } from "../../auth/supabaseClient";

// Alle Ausgaben zu einem FinanceCheck laden
export async function getExpensesByFinanceCheck(financeCheckId) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("check_id", financeCheckId);

  if (error) throw error;
  return data;
}

// Einzelne Ausgabe anlegen
export async function createExpense({
  finance_check_id,
  category_id,
  description,
  amount,
  interval,
  note,
}) {
  // Hole die User-ID vom aktuellen Supabase User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        check_id: finance_check_id,
        category: category_id,
        description,
        amount,
        interval,
        note,
        user_id: user.id, // <<<<<<<<<<<<<<<<<<<
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
