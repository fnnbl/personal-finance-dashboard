import { useState, useEffect } from "react";
import {
  getFinanceChecksByUser,
  createFinanceCheck,
} from "../api/crud/crud_financeCheck";
import { useAuth } from "../common/AuthContext";
import { Link } from "react-router-dom";
import styles from "./FinanceChecksPage.module.css";

function FinanceChecksPage() {
  const { user } = useAuth();
  const [checks, setChecks] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchChecks();
  }, [user]);

  async function fetchChecks() {
    setLoading(true);
    try {
      const data = await getFinanceChecksByUser(user.id);
      setChecks(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCheck(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await createFinanceCheck(user.id, newName.trim());
      setNewName("");
      fetchChecks();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>MEINE E&A-CHECKS</h1>
      <form className={styles.formRow} onSubmit={handleAddCheck}>
        <input
          className={styles.newCheckInput}
          placeholder="Name für neuen E&A-Check"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={loading}
        />
        <button className={styles.addBtn} type="submit" disabled={loading}>
          Neu anlegen
        </button>
      </form>
      <ul className={styles.checkList}>
        {checks.map((check) => (
          <li key={check.id} className={styles.checkItem}>
            <Link
              className={styles.checkLink}
              to={`/finance-checks/${check.id}`}
            >
              {check.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FinanceChecksPage;