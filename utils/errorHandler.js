/**
 * Custom error class for API-related errors
 */
class APIError extends Error {
    constructor(message, statusCode, source) {
      super(message);
      this.name = 'APIError';
      this.statusCode = statusCode;
      this.source = source;
    }
  }
  
  /**
   * Format an error for the GraphQL response
   * @param {Error} error - The error to format
   * @returns {Object} Formatted error object
   */
  const formatError = (error) => {
    console.error('GraphQL Error:', error);
    
    // If this is one of our custom API errors
    if (error.originalError instanceof APIError) {
      const originalError = error.originalError;
      return {
        message: originalError.message,
        extensions: {
          code: originalError.statusCode ? `ERROR_${originalError.statusCode}` : 'INTERNAL_SERVER_ERROR',
          source: originalError.source,
          path: error.path
        }
      };
    }
    
    // For other errors, provide a generic message
    return {
      message: error.message || 'An unexpected error occurred',
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        path: error.path
      }
    };
};
  
module.exports = {
    APIError,
    formatError
};