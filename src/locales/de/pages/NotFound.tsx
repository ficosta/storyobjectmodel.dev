import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <div className="wrap narrow center">
        <p className="eyebrow">404</p>
        <h1>Zu diesem Thema nichts</h1>
        <p className="lede" style={{ margin: '0 auto 26px' }}>
          Die angefragte Seite ist nicht auf dem Bus. Versuchen Sie es stattdessen mit dem Kernkreislauf.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn primary" to="/de">
            Startseite →
          </Link>
          <Link className="btn" to="/de/concepts">
            Konzepte
          </Link>
        </div>
      </div>
    </section>
  );
}
