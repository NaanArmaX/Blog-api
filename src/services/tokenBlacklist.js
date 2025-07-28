const redis = require('../utils/redis')

async function blacklistToken(token, expiresInSeconds) {
  await redis.set(token, 'revoked', 'EX', expiresInSeconds)
}

async function isTokenRevoked(token) {
  const result = await redis.get(token)
  return result === 'revoked'
}

module.exports = {
  blacklistToken,
  isTokenRevoked
}
