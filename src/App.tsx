import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Concepts from './pages/Concepts';
import Envelope from './pages/Envelope';
import Bus from './pages/Bus';
import Skills from './pages/Skills';
import GetStarted from './pages/GetStarted';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/envelope" element={<Envelope />} />
          <Route path="/bus" element={<Bus />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
