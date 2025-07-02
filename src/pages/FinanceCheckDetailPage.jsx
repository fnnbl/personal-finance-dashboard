import { useParams } from "react-router-dom";

function FinanceCheckDetailPage() {
  const { checkId } = useParams();

  return (
    <div>
      <h2>Finanz-Check Detailansicht</h2>
      <p>
        Check-ID: <b>{checkId}</b>
      </p>
      {/* Hier folgen später Einnahmen, Ausgaben, Diagramm, etc. */}
    </div>
  );
}

export default FinanceCheckDetailPage;
