const { RESTDataSource } = require('apollo-datasource-rest');
const cache = require('../utils/cache');

class StackOverflowAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.stackexchange.com/2.3/';
  }

  async getQuestions(filter = {}) {
    const userId = process.env.STACKOVERFLOW_USER_ID;
    const cacheKey = `stackoverflow:questions:${userId}:${JSON.stringify(filter)}`;
    
    return cache.getOrCompute(cacheKey, async () => {
      const params = {
        site: 'stackoverflow',
        key: process.env.STACKOVERFLOW_KEY,
        filter: '!-*jbN-o8P3E5',  // Filter to include needed fields
        userId
      };
      
      // Add filter params if provided
      if (filter.tag) {
        params.tagged = filter.tag;
      }
      
      try {
        const response = await this.get('users/' + userId + '/questions', params);
        
        let questions = response.items.map(item => this.questionReducer(item));
        
        // Apply filters
        if (filter.answered !== undefined) {
          questions = questions.filter(q => q.answered === filter.answered);
        }
        
        if (filter.limit) {
          questions = questions.slice(0, filter.limit);
        }
        
        return questions;
      } catch (error) {
        console.error('Error fetching Stack Overflow questions:', error);
        return []; // Return empty array on error
      }
    });
  }

  async getQuestion(id) {
    const params = {
      site: 'stackoverflow',
      key: process.env.STACKOVERFLOW_KEY,
      filter: '!-*jbN-o8P3E5'  // Filter to include needed fields
    };
    
    const response = await this.get(`questions/${id}`, params);
    
    if (response.items && response.items.length > 0) {
      return this.questionReducer(response.items[0]);
    }
    
    return null;
  }

  questionReducer(item) {
    return {
      id: item.question_id.toString(),
      title: item.title,
      link: item.link,
      score: item.score,
      tags: item.tags,
      answered: item.is_answered,
      createdDate: new Date(item.creation_date * 1000).toISOString()
    };
  }
}

module.exports = StackOverflowAPI;