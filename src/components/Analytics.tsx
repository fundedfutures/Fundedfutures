import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const measurementId = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_GA_MEASUREMENT_ID;
const enabled = /^G-[A-Z0-9]+$/.test(measurementId || '');
let started = false;
let previousPage = '';
let consent = false;
const analyticsWindow = window as typeof window & {
  dataLayer: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

export function trackEvent(name: string, parameters: Record<string, string | number> = {}) {
  if (enabled && consent) analyticsWindow.gtag?.('event', name, parameters);
}

export function updateAnalyticsConsent(accepted: boolean) {
  localStorage.setItem('analyticsConsent', accepted ? 'accepted' : 'rejected');
  window.dispatchEvent(new Event('analytics-consent'));
}

function initialize() {
  if (!enabled || !consent || started) return;
  started = true;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = (...args) => { analyticsWindow.dataLayer.push(args); };
  analyticsWindow.gtag('js', new Date());
  analyticsWindow.gtag('config', measurementId, { send_page_view: false, allow_google_signals: false, page_location: `${location.origin}${location.pathname}`, page_referrer: document.referrer.split('?')[0].split('#')[0] });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export default function Analytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    const url = `${window.location.origin}${pathname}`;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') || document.head.appendChild(document.createElement('link'));
    canonical.rel = 'canonical';
    canonical.href = `https://fundededucationfutures.com${pathname}`;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = pathname === '/thank-you' ? 'noindex, follow' : 'index, follow';
    const sync = () => {
      consent = localStorage.getItem('analyticsConsent') === 'accepted';
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = !consent;
      if (!consent) previousPage = '';
      initialize();
      if (consent && previousPage !== url) {
        trackEvent('page_view', { page_location: url, page_referrer: previousPage || document.referrer.split('?')[0].split('#')[0], page_title: document.title });
        previousPage = url;
      }
    };
    sync();
    window.addEventListener('analytics-consent', sync);
    return () => window.removeEventListener('analytics-consent', sync);
  }, [pathname]);

  useEffect(() => {
    // Only structural labels are collected: never input values, contact details, or transaction codes.
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a,button,[data-analytics-action]') : null;
      if (!target) return;
      const anchor = target instanceof HTMLAnchorElement ? target : null;
      const label = (target.getAttribute('data-analytics-action') || target.getAttribute('aria-label') || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      const safeLabel = /@|\d{7,}/.test(label) ? 'contact_action' : label;
      const params: Record<string, string> = { action: safeLabel, page_path: window.location.pathname };
      if (anchor) {
        const url = new URL(anchor.href, window.location.origin);
        params.link_destination = /^(https?:)$/.test(url.protocol) ? `${url.origin}${url.pathname}` : url.protocol;
      }
      trackEvent(anchor ? 'link_click' : 'button_click', params);
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
  return null;
}
