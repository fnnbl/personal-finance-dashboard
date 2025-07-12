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
import styles from "./FinanceCheckDetailPage.module.css";

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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
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

      setNewExpense((prev) => ({
        ...prev,
        category_id: catData && catData.length > 0 ? catData[0].id : "",
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
        category_id:
          categories && categories.length > 0 ? categories[0].id : "",
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

  // Sum helpers
  const incomeSum = incomes.reduce((acc, item) => acc + Number(item.amount), 0);
  const expenseSum = expenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );
  const balance = incomeSum - expenseSum;

  return (
    <div className={styles.detailContainer}>
      <h2 className={styles.heading}>Detailansicht</h2>
      {financeCheck && (
        <p className={styles.financeCheckName}>{financeCheck.name}</p>
      )}
      {loading && <p>Lade Daten ...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Einnahmen */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h3 className={styles.subheading}>Einnahmen</h3>
          <button
            type="button"
            className="btn"
            onClick={() => setIncomeModalOpen(true)}
          >
            Neue Einnahme
          </button>
        </div>
        {/* Tabelle Einnahmen */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Beschreibung</th>
                <th>Betrag (€)</th>
                <th>Intervall</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc) => (
                <tr key={inc.id}>
                  <td>{inc.description}</td>
                  <td>
                    {Number(inc.amount).toLocaleString("de-DE", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{inc.interval}</td>
                </tr>
              ))}
              {incomes.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{ color: "#888", textAlign: "center" }}
                  >
                    Keine Einnahmen vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={1} className={styles.sumRow}>
                  Summe Einnahmen:
                </td>
                <td colSpan={2} className={styles.sumRow}>
                  {incomeSum.toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                  })}
                  €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Einnahmen */}
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
      <div style={{ marginTop: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h3 className={styles.subheading}>Ausgaben</h3>
          <button
            type="button"
            className="btn"
            onClick={() => setExpenseModalOpen(true)}
          >
            Neue Ausgabe
          </button>
        </div>
        {/* Tabelle Ausgaben */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Beschreibung</th>
                <th>Kategorie</th>
                <th>Betrag (€)</th>
                <th>Intervall</th>
                <th>Bemerkung</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => {
                const cat = exp.category
                  ? categories.find((c) => c.id === exp.category)
                  : null;
                return (
                  <tr key={exp.id}>
                    <td>{exp.description}</td>
                    <td>{cat ? cat.name : "-"}</td>
                    <td>
                      {Number(exp.amount).toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>{exp.interval}</td>
                    <td>{exp.note || ""}</td>
                  </tr>
                );
              })}
              {expenses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ color: "#888", textAlign: "center" }}
                  >
                    Keine Ausgaben vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className={styles.sumRow}>
                  Summe Ausgaben:
                </td>
                <td colSpan={3} className={styles.sumRow}>
                  {expenseSum.toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                  })}
                  €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Ausgaben */}
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
            {categories.length === 0 ? (
              <div style={{ color: "#d32f2f" }}>Keine Kategorien gefunden!</div>
            ) : (
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
            )}
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
      <div className={styles.balanceBox}>
        <h3 className={styles.balance}>Bilanz:</h3>
        <b
          className={
            balance >= 0
              ? styles.balanceValue
              : `${styles.balanceValue} ${styles.deficit}`
          }
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
