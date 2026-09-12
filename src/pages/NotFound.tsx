import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <div className="wrap narrow center">
        <p className="eyebrow">404</p>
        <h1>Nothing on that topic</h1>
        <p className="lede" style={{ margin: '0 auto 26px' }}>
          The page you asked for isn’t on the bus. Try the core loop instead.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn primary" to="/">
            Home →
          </Link>
          <Link className="btn" to="/concepts">
            Concepts
          </Link>
        </div>
      </div>
    </section>
  );
}
