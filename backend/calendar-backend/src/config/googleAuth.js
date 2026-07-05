const { OAuth2Client } = require('google-auth-library');
const env = require('./env');

const client = new OAuth2Client(env.googleClientId);

/**
 * Verifies a Google ID token sent from the frontend and returns the payload.
 * @param {string} idToken - The ID token issued by Google Sign-In on the client.
 * @returns {Promise<import('google-auth-library').TokenPayload>}
 */
async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });
  return ticket.getPayload();
}

module.exports = { verifyGoogleToken };
