import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getIncomesByFinanceCheck,
  createIncome,
} from "../api/crud/crud_incomes";
import {
  getExpensesByFinanceCheck,
  createExpense,
} from "../api/crud/crud_expenses";
import { getFinanceCheckById } from "../api/crud/crud_financeCheck";
import { getExpenseCategories } from "../api/crud/crud_expenseCategories";
import Modal from "../components/Modal";

function FinanceCheckDetailPage() {
  const { checkId } = useParams();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [financeCheck, setFinanceCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  // Modal States
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Form States
  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    interval: "monatlich",
  });
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category_id: "",
    interval: "monatlich",
    note: "",
  });

  // Initialdaten laden
  useEffect(() => {
    fetchData();
  }, [checkId]);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const checkData = await getFinanceCheckById(checkId);
      setFinanceCheck(checkData);
      const incomeData = await getIncomesByFinanceCheck(checkId);
      setIncomes(incomeData);
      const expenseData = await getExpensesByFinanceCheck(checkId);
      setExpenses(expenseData);
      const catData = await getExpenseCategories();
      setCategories(catData);
      // Set default Kategorie im Formular
      setNewExpense((prev) => ({
        ...prev,
        category_id: catData[0]?.id || "",
      }));
    } catch (err) {
      setError("Fehler beim Laden: " + err.message);
    }
    setLoading(false);
  }

  // Neue Einnahme speichern
  async function handleSaveIncome(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createIncome({
        finance_check_id: checkId,
        description: newIncome.description,
        amount: parseFloat(newIncome.amount),
        interval: newIncome.interval,
      });
      setNewIncome({ description: "", amount: "", interval: "monatlich" });
      setIncomeModalOpen(false);
      fetchData();
    } catch (err) {
      setError("Fehler beim Anlegen: " + err.message);
    }
    setLoading(false);
  }

  // Neue Ausgabe speichern
  async function handleSaveExpense(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createExpense({
        finance_check_id: checkId,
        category_id: Number(newExpense.category_id),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        interval: newExpense.interval,
        note: newExpense.note,
      });
      setNewExpense({
        description: "",
        amount: "",
        category_id: categories[0]?.id || "",
        interval: "monatlich",
        note: "",
      });
      setExpenseModalOpen(false);
      fetchData();
    } catch (err) {
      setError("Fehler beim Anlegen: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      <h2>Detailansicht</h2>
      {financeCheck && (
        <p style={{ fontSize: 24, fontWeight: 700 }}>{financeCheck.name}</p>
      )}
      {loading && <p>Lade Daten ...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Einnahmen */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h3 style={{ margin: 0 }}>Einnahmen</h3>
          <button
            type="button"
            className="btn"
            onClick={() => setIncomeModalOpen(true)}
          >
            Neue Einnahme
          </button>
        </div>
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
          {incomes
            .reduce((acc, item) => acc + Number(item.amount), 0)
            .toLocaleString("de-DE", { minimumFractionDigits: 2 })}
          €
        </b>
      </div>

      {/* Einnahmen Modal */}
      <Modal open={incomeModalOpen} onClose={() => setIncomeModalOpen(false)}>
        <form onSubmit={handleSaveIncome}>
          <h3>Neue Einnahme anlegen</h3>
          <div style={{ marginBottom: 18 }}>
            <label>Beschreibung</label>
            <input
              required
              value={newIncome.description}
              onChange={(e) =>
                setNewIncome({ ...newIncome, description: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Betrag (€)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Intervall</label>
            <select
              value={newIncome.interval}
              onChange={(e) =>
                setNewIncome({ ...newIncome, interval: e.target.value })
              }
              style={{ width: "100%" }}
            >
              <option value="monatlich">monatlich</option>
              <option value="vierteljährlich">vierteljährlich</option>
              <option value="halbjährlich">halbjährlich</option>
              <option value="jährlich">jährlich</option>
            </select>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            Speichern
          </button>
        </form>
      </Modal>

      {/* Ausgaben */}
      <div style={{ marginTop: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h3 style={{ margin: 0 }}>Ausgaben</h3>
          <button
            type="button"
            className="btn"
            onClick={() => setExpenseModalOpen(true)}
          >
            Neue Ausgabe
          </button>
        </div>
        <ul>
          {expenses.map((exp) => (
            <li key={exp.id}>
              {exp.description} – {exp.amount}€
              {exp.category && (
                <span style={{ color: "#888" }}>
                  {" "}
                  [{categories.find((c) => c.id === exp.category)?.name || "-"}]
                </span>
              )}
              <span style={{ color: "#888" }}> ({exp.interval})</span>
            </li>
          ))}
        </ul>
        <b>
          Summe Ausgaben:{" "}
          {expenses
            .reduce((acc, item) => acc + Number(item.amount), 0)
            .toLocaleString("de-DE", { minimumFractionDigits: 2 })}
          €
        </b>
      </div>

      {/* Ausgaben Modal */}
      <Modal open={expenseModalOpen} onClose={() => setExpenseModalOpen(false)}>
        <form onSubmit={handleSaveExpense}>
          <h3>Neue Ausgabe anlegen</h3>
          <div style={{ marginBottom: 18 }}>
            <label>Beschreibung</label>
            <input
              required
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Betrag (€)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Kategorie</label>
            <select
              required
              value={newExpense.category_id}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category_id: e.target.value })
              }
              style={{ width: "100%" }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Intervall</label>
            <select
              value={newExpense.interval}
              onChange={(e) =>
                setNewExpense({ ...newExpense, interval: e.target.value })
              }
              style={{ width: "100%" }}
            >
              <option value="monatlich">monatlich</option>
              <option value="vierteljährlich">vierteljährlich</option>
              <option value="halbjährlich">halbjährlich</option>
              <option value="jährlich">jährlich</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Bemerkung</label>
            <input
              value={newExpense.note}
              onChange={(e) =>
                setNewExpense({ ...newExpense, note: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            Speichern
          </button>
        </form>
      </Modal>

      {/* Bilanz */}
      <div style={{ marginTop: 36 }}>
        <h3>Bilanz:</h3>
        <b
          style={{
            color:
              incomes.reduce((a, i) => a + Number(i.amount), 0) -
                expenses.reduce((a, i) => a + Number(i.amount), 0) >=
              0
                ? "#2e7d32"
                : "#d32f2f",
            fontSize: 22,
          }}
        >
          {incomes.reduce((a, i) => a + Number(i.amount), 0) -
            expenses.reduce((a, i) => a + Number(i.amount), 0) >=
          0
            ? "Überschuss"
            : "Defizit"}
          :{" "}
          {(
            incomes.reduce((a, i) => a + Number(i.amount), 0) -
            expenses.reduce((a, i) => a + Number(i.amount), 0)
          ).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
          })}
          €
        </b>
      </div>
    </div>
  );
}

export default FinanceCheckDetailPage;
