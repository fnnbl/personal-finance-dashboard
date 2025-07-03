import { useState } from "react";
import { useAuth } from "../common/AuthContext";
import { createFinanceCheck } from "../api/crud/crud_financeCheck";
import { useNavigate } from "react-router-dom";

function FinanceCheckCreatePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const check = await createFinanceCheck({ user_id: user.id, name });
      navigate(`/finance-checks/${check.id}`); // direkt zur Detailansicht
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 32,
        borderRadius: 18,
        background: "var(--main-box-bg)",
      }}
    >
      <h2>Neuen E&A-Check anlegen</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name für den Check:
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              marginTop: 8,
              marginBottom: 16,
              padding: 8,
              borderRadius: 8,
            }}
            disabled={loading}
          />
        </label>
        <button type="submit" className="btn" disabled={loading || !name}>
          {loading ? "Speichere..." : "Anlegen"}
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

export default FinanceCheckCreatePage;
