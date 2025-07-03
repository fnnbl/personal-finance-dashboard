import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getIncomesByFinanceCheck } from "../api/crud/crud_incomes";
import { getExpensesByFinanceCheck } from "../api/crud/crud_expenses";
import { getFinanceCheckById } from "../api/crud/crud_financeCheck";

// Neue Funktionen, die die Views abfragen:
import { getIncomeSumByFinanceCheck } from "../api/crud/crud_incomes";
import { getExpenseSumByFinanceCheck } from "../api/crud/crud_expenses";

function FinanceCheckDetailPage() {
  const { checkId } = useParams();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [financeCheck, setFinanceCheck] = useState(null);
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Hole Name & Metadaten des Checks
        const checkData = await getFinanceCheckById(checkId);
        setFinanceCheck(checkData);

        // Hole Einnahmen und Ausgaben (Einzelposten)
        const incomeData = await getIncomesByFinanceCheck(checkId);
        const expenseData = await getExpensesByFinanceCheck(checkId);
        setIncomes(incomeData);
        setExpenses(expenseData);

        // Hole Summen über Views
        const sumIncomes = await getIncomeSumByFinanceCheck(checkId);
        setIncomeSum(Number(sumIncomes));

        const sumExpenses = await getExpenseSumByFinanceCheck(checkId);
        setExpenseSum(Number(sumExpenses));
      } catch (err) {
        setError("Fehler beim Laden: " + err.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [checkId]);

  const balance = incomeSum - expenseSum;

  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      <h2>Detailansicht</h2>
      {financeCheck && (
        <p style={{ fontSize: 24, fontWeight: 700 }}>{financeCheck.name}</p>
      )}

      {loading && <p>Lade Daten</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Einnahmen */}
      <div style={{ marginTop: 40 }}>
        <h3>Einnahmen</h3>
        <ul>
          {incomes.map((inc) => (
            <li key={inc.id}>
              {inc.description} – {inc.amount}€{" "}
              <span style={{ color: "#888" }}>({inc.interval})</span>
            </li>
          ))}
        </ul>
        <b>
          Summe Einnahmen:{" "}
          {Number(incomeSum).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
          })}
          €
        </b>
      </div>

      {/* Ausgaben */}
      <div style={{ marginTop: 30 }}>
        <h3>Ausgaben</h3>
        <ul>
          {expenses.map((exp) => (
            <li key={exp.id}>
              {exp.description} – {exp.amount}€{" "}
              <span style={{ color: "#888" }}>({exp.interval})</span>
            </li>
          ))}
        </ul>
        <b>
          Summe Ausgaben:{" "}
          {Number(expenseSum).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
          })}
          €
        </b>
      </div>

      {/* Bilanz */}
      <div style={{ marginTop: 36 }}>
        <h3>Bilanz:</h3>
        <b
          style={{
            color: balance >= 0 ? "#2e7d32" : "#d32f2f",
            fontSize: 22,
          }}
        >
          {balance >= 0 ? "Überschuss" : "Defizit"}:{" "}
          {balance.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
          })}
          €
        </b>
      </div>
    </div>
  );
}

export default FinanceCheckDetailPage;
