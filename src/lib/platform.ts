/**
 * Are we running on a managed host with an ephemeral, read-only filesystem?
 *
 * Two things key off this and neither can use NODE_ENV: `next start` on a
 * laptop and a CI run are both production builds where local files and the
 * development sign-in path are entirely legitimate.
 */
export function isManagedHost(): boolean {
  return Boolean(
    process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME,
  );
}
