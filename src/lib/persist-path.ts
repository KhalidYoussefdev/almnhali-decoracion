import path from 'path';

/**
 * Shared persistent data directory.
 * Lives outside the app folder so Hostinger redeploys do not wipe admin edits,
 * uploads, orders, or customer accounts.
 *
 * Set DATA_DIR on Hostinger to an absolute path if you want a custom location.
 */
export function getDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  return path.join(process.cwd(), '..', 'almnhali-data');
}
