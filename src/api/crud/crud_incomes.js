import { supabase } from "../../auth/supabaseClient";

// Alle Einnahmen zu einem FinanceCheck laden
export async function getIncomesByFinanceCheck(financeCheckId) {
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("check_id", financeCheckId); // <-- angepasst

  if (error) throw error;
  return data;
}

// Einzelne Einnahme anlegen
export async function createIncome({
  finance_check_id, // bleibt im Input-Objekt
  description,
  amount,
  interval,
}) {
  const { data, error } = await supabase
    .from("incomes")
    .insert([
      {
        check_id: finance_check_id, // <-- Mapping auf Spaltennamen!
        description,
        amount,
        interval,
      },
    ])
    .single();

  if (error) throw error;
  return data;
}

// Einzelne Einnahme updaten
export async function updateIncome(id, updates) {
  const { data, error } = await supabase
    .from("incomes")
    .update(updates)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Einzelne Einnahme löschen
export async function deleteIncome(id) {
  const { error } = await supabase.from("incomes").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function getIncomeSumByFinanceCheck(checkId) {
  const { data, error } = await supabase
    .from("incomes_sum_by_check")
    .select("sum")
    .eq("check_id", checkId)
    .single();
  if (error) throw error;
  return data?.sum ?? 0;
}
