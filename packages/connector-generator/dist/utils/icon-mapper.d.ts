/**
 * Icon Mapper Utility
 *
 * Maps service names to n8n SVG icon files
 */
/**
 * Get Phosphor icon for a service
 * @param serviceId - The service identifier (e.g., 'gmail', 'slack')
 * @returns Phosphor icon class name
 */
export declare function getServiceIcon(serviceId: string): string;
/**
 * Check if a service has a custom icon mapping
 * @param serviceId - The service identifier
 * @returns True if service has a custom icon
 */
export declare function hasCustomIcon(serviceId: string): boolean;
/**
 * Add or update a service icon mapping
 * @param serviceId - The service identifier
 * @param icon - The Phosphor icon class name
 */
export declare function setServiceIcon(serviceId: string, icon: string): void;
