
// Environment configuration
// Change Api's Here

export const config = {
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY || 'd9fa6f599339d23ed1f9c0070105b8dc',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p'
  },
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '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',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions'
  }
};

// Validation
if (!config.tmdb.apiKey) {
  console.warn('TMDB API key not found. Please set VITE_TMDB_API_KEY environment variable.');
}

if (!config.groq.apiKey) {
  console.warn('Groq API key not found. Please set VITE_GROQ_API_KEY environment variable.');
}
