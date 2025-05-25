/**
 * Get environment variable with optional fallback
 * @param key Environment variable key
 * @param fallback Optional fallback value
 * @returns The environment variable value or fallback
 */
export function getEnvVar(key: string, fallback: string = ''): string {
  return process.env[key] || fallback;
}