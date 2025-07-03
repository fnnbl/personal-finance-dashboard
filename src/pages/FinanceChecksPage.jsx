import { useState, useEffect } from "react";
import { getFinanceChecksByUser } from "../api/crud/crud_financeCheck";
import { useAuth } from "../common/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./FinanceChecksPage.module.css";

function FinanceChecksPage() {
  const { user } = useAuth();
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  function handleCreateClick() {
    navigate("/finance-checks/new");
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headingRow}>
        <h1 className={styles.heading}>Meine Einnahmen & Ausgaben-Checks</h1>
        <button className="btn" onClick={handleCreateClick}>
          Neu anlegen
        </button>
      </div>
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
