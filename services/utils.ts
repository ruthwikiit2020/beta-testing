// Utility functions for the application

// Retry function for handling temporary API errors
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryableError = error?.code === 503 || 
                              error?.message?.includes('quota') ||
                              error?.message?.includes('rate limit') ||
                              error?.message?.includes('timeout');
      
      if (attempt === maxRetries || !isRetryableError) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}
