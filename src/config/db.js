const mongoose = require('mongoose');
const dns = require('dns');

// Optionally override DNS servers used by Node's resolver (comma-separated list)
if (process.env.DNS_SERVERS) {
  try {
    const servers = process.env.DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean);
    if (servers.length) {
      dns.setServers(servers);
      console.log(`Using DNS servers from DNS_SERVERS: ${servers.join(',')}`);
    }
  } catch (e) {
    console.warn('Failed to set DNS_SERVERS:', e.message);
  }
}

/**
 * connectDB
 * - Attempts to connect to MongoDB with retries.
 * - Returns true when connected, false otherwise. Does NOT call process.exit.
 *
 * Options:
 *  - retries: number of attempts (default 5)
 *  - baseDelayMs: initial backoff delay in ms (default 1000)
 */
const connectDB = async (opts = {}) => {
  // Support both MONGO_URI and MONGODB_URI env var names (some hosts/use-cases use the latter)
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('Missing MONGO_URI or MONGODB_URI environment variable. Skipping DB connection.');
    return false;
  }
  console.log(`Using Mongo URI from ${process.env.MONGO_URI ? 'MONGO_URI' : 'MONGODB_URI'}`);

  const maxRetries = typeof opts.retries === 'number' ? opts.retries : 5;
  const baseDelay = typeof opts.baseDelayMs === 'number' ? opts.baseDelayMs : 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected');
      return true;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('All MongoDB connection attempts failed. Continuing without DB.');
        return false;
      }
    }
  }
  return false;
};

module.exports = connectDB;
