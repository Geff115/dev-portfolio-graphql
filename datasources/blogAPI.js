const { RESTDataSource } = require('apollo-datasource-rest');

class BlogAPI extends RESTDataSource {
  constructor() {
    super();
    // We're using Dev.to API as an example
    this.baseURL = 'https://dev.to/api/';
  }

  willSendRequest(request) {
    // If using Dev.to, you'll need an API key
    if (process.env.DEVTO_API_KEY) {
      request.headers.set('api-key', process.env.DEVTO_API_KEY);
    }
  }

  async getBlogPosts(filter = {}) {
    const username = process.env.DEVTO_USERNAME || process.env.MEDIUM_USERNAME;
    
    // For Dev.to
    let params = { username };
    
    if (filter.tag) {
      params.tag = filter.tag;
    }
    
    // This endpoint works for Dev.to
    const response = await this.get('articles', params);
    
    let posts = response.map(post => this.blogPostReducer(post));
    
    if (filter.limit) {
      posts = posts.slice(0, filter.limit);
    }
    
    return posts;
  }

  async getBlogPost(id) {
    // For Dev.to
    const response = await this.get(`articles/${id}`);
    return this.blogPostReducer(response);
  }

  blogPostReducer(post) {
    // This is for Dev.to format
    return {
      id: post.id.toString(),
      title: post.title,
      link: post.url,
      publishDate: post.published_at,
      excerpt: post.description || post.title,
      tags: post.tag_list || []
    };
  }
}

module.exports = BlogAPI;