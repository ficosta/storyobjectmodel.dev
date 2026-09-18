import type { LocaleBundle } from '../types';
import { FAQS } from './data/faq';
import Home from './pages/Home';
import Concepts from './pages/Concepts';
import Envelope from './pages/Envelope';
import Bus from './pages/Bus';
import Skills from './pages/Skills';
import GetStarted from './pages/GetStarted';
import NotFound from './pages/NotFound';

const bundle: LocaleBundle = {
  pages: { Home, Concepts, Envelope, Bus, Skills, GetStarted, NotFound },
  faqs: FAQS,
};

export default bundle;
