const { RESTDataSource } = require('apollo-datasource-rest');
const cache = require('../utils/cache');

class GitHubAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.github.com/';
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `token ${process.env.GITHUB_TOKEN}`);
    request.headers.set('User-Agent', 'Dev-Portfolio-GraphQL');
  }

  async getRepositories(filter = {}) {
    const username = process.env.GITHUB_USERNAME;
    
    // Generate a cache key that includes any filters
    const cacheKey = `github:repos:${username}:${JSON.stringify(filter)}`;
    
    return cache.getOrCompute(cacheKey, async () => {
      const response = await this.get(`users/${username}/repos`);
      
      // Map repositories and fetch languages for each
      let repositories = await Promise.all(response.map(async repo => {
        const repoData = this.repositoryReducer(repo);
        // Fetch languages with caching
        repoData.languages = await this.getLanguagesForRepo(repo.name);
        return repoData;
      }));
      
      // Apply filters
      if (filter.language) {
        repositories = repositories.filter(repo => 
          repo.languages.some(lang => lang.name.toLowerCase() === filter.language.toLowerCase())
        );
      }
      
      if (filter.minStars) {
        repositories = repositories.filter(repo => repo.stars >= filter.minStars);
      }
      
      if (filter.limit) {
        repositories = repositories.slice(0, filter.limit);
      }
      
      return repositories;
    });
  }

  async getRepository(id) {
    const username = process.env.GITHUB_USERNAME;
    const repositories = await this.getRepositories();
    return repositories.find(repo => repo.id === id);
  }

  async getLanguagesForRepo(repoName) {
    const username = process.env.GITHUB_USERNAME;
    const cacheKey = `github:languages:${username}:${repoName}`;
    
    return cache.getOrCompute(cacheKey, async () => {
      try {
        const langData = await this.get(`repos/${username}/${repoName}/languages`);
        
        // Calculate percentages
        const total = Object.values(langData).reduce((sum, value) => sum + value, 0);
        return Object.entries(langData).map(([name, bytes]) => ({
          name,
          percentage: (bytes / total) * 100
        }));
      } catch (error) {
        console.error(`Error fetching languages for ${repoName}:`, error);
        return []; // Return empty array on error
      }
    }, 86400000); // Cache languages for 24 hours (they change less frequently)
  }

  repositoryReducer(repo) {
    return {
      id: repo.id.toString(),
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      lastUpdated: repo.updated_at,
      // Note: We'll fetch languages separately to get percentages
      languages: [] // This will be populated when needed
    };
  }
}

module.exports = GitHubAPI;