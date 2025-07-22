import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false,
  });
}

export { posthog };

// Analytics event tracking functions
export const trackEvent = (event: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(event, properties);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', { $current_url: url });
  }
}; 