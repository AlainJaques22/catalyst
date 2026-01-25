/**
 * Icon Mapper Utility
 *
 * Maps service names to n8n SVG icon files
 */

/**
 * Service to icon file mapping
 * Uses actual n8n SVG icon files
 */
const SERVICE_ICON_MAP: Record<string, string> = {
  // Email & Communication
  'gmail': 'icons/gmail.svg',
  'outlook': 'ph-envelope',
  'smtp': 'ph-paper-plane-tilt',
  'email': 'ph-envelope-simple',

  // Messaging & Chat
  'slack': 'icons/slack.svg',
  'discord': 'ph-discord-logo',
  'telegram': 'ph-telegram-logo',
  'whatsapp': 'ph-whatsapp-logo',
  'teams': 'ph-microsoft-teams-logo',

  // Social Media
  'twitter': 'ph-twitter-logo',
  'facebook': 'ph-facebook-logo',
  'linkedin': 'ph-linkedin-logo',
  'instagram': 'ph-instagram-logo',

  // Cloud Storage & Data
  'google-sheets': 'ph-table',
  'google-drive': 'ph-google-drive-logo',
  'dropbox': 'ph-dropbox-logo',
  'onedrive': 'ph-folder-simple',
  'airtable': 'ph-database',

  // Development & Tools
  'github': 'ph-github-logo',
  'gitlab': 'ph-gitlab-logo',
  'jira': 'ph-kanban',
  'trello': 'ph-trello-logo',
  'notion': 'ph-note',
  'asana': 'ph-check-square',

  // HTTP & APIs
  'http': 'ph-plugs-connected',
  'webhook': 'ph-webhook',
  'api': 'ph-cloud-arrow-up',

  // Analytics & Monitoring
  'google-analytics': 'ph-chart-line',
  'mixpanel': 'ph-chart-bar',
  'segment': 'ph-broadcast',

  // CRM & Sales
  'salesforce': 'ph-briefcase',
  'hubspot': 'ph-user-circle-gear',
  'pipedrive': 'ph-funnel',
  'zendesk': 'ph-headset',

  // Payment & Finance
  'stripe': 'ph-credit-card',
  'paypal': 'ph-paypal-logo',
  'shopify': 'ph-storefront',

  // Productivity
  'calendar': 'ph-calendar',
  'todo': 'ph-check-circle',
  'notes': 'ph-note-pencil',

  // AI & ML
  'openai': 'ph-brain',
  'anthropic': 'ph-robot',
  'grok': 'ph-brain',
  'ai': 'ph-cpu',

  // Default fallback
  'default': 'ph-plug'
};

/**
 * Get Phosphor icon for a service
 * @param serviceId - The service identifier (e.g., 'gmail', 'slack')
 * @returns Phosphor icon class name
 */
export function getServiceIcon(serviceId: string): string {
  const normalizedId = serviceId.toLowerCase().trim();

  // Direct match
  if (SERVICE_ICON_MAP[normalizedId]) {
    return SERVICE_ICON_MAP[normalizedId];
  }

  // Partial match - check if service ID contains any of the keys
  for (const [key, icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (normalizedId.includes(key) || key.includes(normalizedId)) {
      return icon;
    }
  }

  // Fallback to default
  return SERVICE_ICON_MAP.default;
}

/**
 * Check if a service has a custom icon mapping
 * @param serviceId - The service identifier
 * @returns True if service has a custom icon
 */
export function hasCustomIcon(serviceId: string): boolean {
  const normalizedId = serviceId.toLowerCase().trim();
  return normalizedId in SERVICE_ICON_MAP;
}

/**
 * Add or update a service icon mapping
 * @param serviceId - The service identifier
 * @param icon - The Phosphor icon class name
 */
export function setServiceIcon(serviceId: string, icon: string): void {
  SERVICE_ICON_MAP[serviceId.toLowerCase().trim()] = icon;
}
