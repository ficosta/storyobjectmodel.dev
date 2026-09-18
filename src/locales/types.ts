import type { ComponentType } from 'react';
import type { Faq } from '../data/faq';

/** One component per route, in one language. */
export interface PageSet {
  Home: ComponentType;
  Concepts: ComponentType;
  Envelope: ComponentType;
  Bus: ComponentType;
  Skills: ComponentType;
  GetStarted: ComponentType;
  NotFound: ComponentType;
}

/** What the router and the prerenderer need from each language. */
export interface LocaleBundle {
  pages: PageSet;
  /** The home-page FAQ, which also feeds the FAQPage JSON-LD. */
  faqs: Faq[];
}
