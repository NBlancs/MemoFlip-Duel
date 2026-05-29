const RAILWAY_URL = 'https://memoflip-production.up.railway.app/graphql';
const DEV_URL = process.env.EXPO_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql';

let resolvedUrl: string | null = null;

export const apiConfig = {
  getRailwayUrl(): string {
    return RAILWAY_URL;
  },

  getDevUrl(): string {
    return DEV_URL;
  },

  /**
   * Automatically resolves the best available GraphQL endpoint.
   * Tries to ping the Railway URL first, and falls back to the local dev URL
   * if the Railway URL is unreachable (e.g. offline, local development mode, etc.)
   */
  async getGraphQLUri(): Promise<string> {
    if (resolvedUrl) {
      return resolvedUrl;
    }

    try {
      // Fast fetch with a short timeout to check if the railway server is live
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const healthUrl = 'https://memoflip-production.up.railway.app/health';
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        resolvedUrl = RAILWAY_URL;
        console.log('[API Config] Deployed Railway backend is online. Resolving to:', resolvedUrl);
        return resolvedUrl;
      }
    } catch (error) {
      console.log('[API Config] Deployed Railway backend not reachable, falling back to local dev url:', error);
    }

    resolvedUrl = DEV_URL;
    console.log('[API Config] Resolving to local dev url:', resolvedUrl);
    return DEV_URL;
  },
};
