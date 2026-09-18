import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <div className="wrap narrow center">
        <p className="eyebrow">404</p>
        <h1>Nada nesse topic</h1>
        <p className="lede" style={{ margin: '0 auto 26px' }}>
          A página que você pediu não está no barramento. Experimente o ciclo principal.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn primary" to="/pt">
            Início →
          </Link>
          <Link className="btn" to="/pt/concepts">
            Conceitos
          </Link>
        </div>
      </div>
    </section>
  );
}
