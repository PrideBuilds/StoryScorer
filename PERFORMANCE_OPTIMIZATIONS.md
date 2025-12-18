# Performance Optimizations

This document outlines the performance optimizations implemented in StoryScorer.

## 1. Next.js Configuration

### Image Optimization
- Configured Next.js Image component with WebP and AVIF support
- Set up proper image sizes and device breakpoints
- Enabled image compression and caching

### Caching Headers
- Static assets: 1 year cache with immutable flag
- API responses: Stale-while-revalidate strategy
- Security headers: DNS prefetch, frame options, content type options

### Bundle Optimization
- Enabled package import optimization for `lucide-react` and Radix UI icons
- Removed `X-Powered-By` header for security

## 2. Code Splitting

### Dynamic Imports
- **AnalysisResults Component**: Lazy loaded with dynamic import
  - Only loads when analysis results are displayed
  - Includes loading state with spinner
  - Disabled SSR for client-only component

### Route-Based Splitting
- Next.js automatically splits code by route
- Marketing pages and dashboard pages are separate bundles

## 3. Caching Strategies

### API Route Caching
- **GET /api/stories**: Implements stale-while-revalidate
  - Cache for 60 seconds
  - Revalidate in background after 5 minutes
  - Private cache (user-specific data)

### React Server Components
- Landing page uses Server Components where possible
- Dashboard pages use Server Components for initial data fetching

## 4. Loading States

### Skeleton Screens
- **StoryCardSkeleton**: Reusable skeleton for story cards
- **History Page**: Shows 5 skeleton cards while loading
- Better UX than spinner-only loading states

### Component Loading States
- AnalysisResults component shows spinner while loading
- All async operations have loading indicators

## 5. Database Optimizations

### Indexes
The database schema includes comprehensive indexes:

- **user_stories table**:
  - `idx_user_stories_user_id`: User lookup
  - `idx_user_stories_created_at`: Date sorting
  - `idx_user_stories_score`: Score filtering
  - `idx_user_stories_story_text_search`: Full-text search (GIN index)
  - `idx_user_stories_tags`: Tag filtering (GIN index)

- **subscriptions table**:
  - `idx_subscriptions_user_id`: User lookup
  - `idx_subscriptions_stripe_customer_id`: Customer lookup
  - `idx_subscriptions_stripe_subscription_id`: Subscription lookup
  - `idx_subscriptions_status`: Status filtering

- **usage_tracking table**:
  - `idx_usage_tracking_user_id`: User lookup
  - `idx_usage_tracking_period`: Period filtering

## 6. Performance Monitoring

### Recommended Tools
- **Lighthouse**: Run audits on all major pages
- **Web Vitals**: Monitor Core Web Vitals in production
- **Bundle Analyzer**: Use `@next/bundle-analyzer` to analyze bundle sizes

### Performance Targets
- Lighthouse Performance Score: 90+
- Lighthouse Accessibility Score: 90+
- Lighthouse Best Practices Score: 90+
- Lighthouse SEO Score: 90+

## 7. Future Optimizations

### Potential Improvements
1. **Service Worker**: Implement offline support and caching
2. **React Query/SWR**: Add for better data fetching and caching
3. **Image CDN**: Use a CDN for static images
4. **Database Connection Pooling**: Optimize Supabase connections
5. **Redis Caching**: Add Redis for rate limiting and caching
6. **Edge Functions**: Move some API routes to Edge Functions
7. **Incremental Static Regeneration**: For marketing pages

## 8. Monitoring

### Metrics to Track
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### Tools
- Vercel Analytics (if deployed on Vercel)
- Google Analytics 4
- Custom performance monitoring

