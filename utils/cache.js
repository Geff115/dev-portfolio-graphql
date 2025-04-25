/**
 * A simple in-memory cache implementation
 */
class MemoryCache {
    constructor(ttl = 3600000) {
      this.cache = new Map();
      this.ttl = ttl; // Default TTL: 1 hour in milliseconds
    }
  
    /**
     * Get a value from the cache
     * @param {string} key - Cache key
     * @returns {*} The cached value or undefined if not found
     */
    get(key) {
      const item = this.cache.get(key);
      if (!item) return undefined;
      
      // Check if the item has expired
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
        return undefined;
      }
      
      return item.value;
    }
  
    /**
     * Set a value in the cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds (optional)
     */
    set(key, value, ttl = this.ttl) {
      const expiry = Date.now() + ttl;
      this.cache.set(key, { value, expiry });
    }
  
    /**
     * Delete a value from the cache
     * @param {string} key - Cache key
     */
    delete(key) {
      this.cache.delete(key);
    }
  
    /**
     * Clear the entire cache
     */
    clear() {
      this.cache.clear();
    }
  
    /**
     * Get a cached value or compute it if not available
     * @param {string} key - Cache key
     * @param {Function} compute - Function to compute the value if not cached
     * @param {number} ttl - Time to live in milliseconds (optional)
     * @returns {Promise<*>} The cached or computed value
     */
    async getOrCompute(key, compute, ttl = this.ttl) {
      const cachedValue = this.get(key);
      if (cachedValue !== undefined) {
        return cachedValue;
      }
      
      const computedValue = await compute();
      this.set(key, computedValue, ttl);
      return computedValue;
    }
  }
  
  // Create a singleton instance
  const cache = new MemoryCache(process.env.CACHE_TTL || 3600000);
  
  module.exports = cache;