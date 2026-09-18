import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <div className="wrap narrow center">
        <p className="eyebrow">404</p>
        <h1>Nada en ese topic</h1>
        <p className="lede" style={{ margin: '0 auto 26px' }}>
          La página que buscas no está en el bus. Prueba mejor con el ciclo principal.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn primary" to="/es">
            Inicio →
          </Link>
          <Link className="btn" to="/es/concepts">
            Conceptos
          </Link>
        </div>
      </div>
    </section>
  );
}
