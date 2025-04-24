const resolvers = {
    Query: {
      // GitHub resolvers
      repositories: async (_, { filter }, { dataSources }) => {
        return dataSources.githubAPI.getRepositories(filter);
      },
      repository: async (_, { id }, { dataSources }) => {
        return dataSources.githubAPI.getRepository(id);
      },
      
      // Stack Overflow resolvers
      stackOverflowQuestions: async (_, { filter }, { dataSources }) => {
        return dataSources.stackOverflowAPI.getQuestions(filter);
      },
      stackOverflowQuestion: async (_, { id }, { dataSources }) => {
        return dataSources.stackOverflowAPI.getQuestion(id);
      },
      
      // Blog resolvers
      blogPosts: async (_, { filter }, { dataSources }) => {
        return dataSources.blogAPI.getBlogPosts(filter);
      },
      blogPost: async (_, { id }, { dataSources }) => {
        return dataSources.blogAPI.getBlogPost(id);
      },
      
      // Combined timeline resolver
      allActivity: async (_, { tags, after, limit = 10 }, { dataSources }) => {
        // Fetch data from all sources
        const [repositories, questions, posts] = await Promise.all([
          dataSources.githubAPI.getRepositories(),
          dataSources.stackOverflowAPI.getQuestions(),
          dataSources.blogAPI.getBlogPosts()
        ]);
        
        // Convert to unified activity format
        const activities = [
          ...repositories.map(repo => ({
            id: `github-${repo.id}`,
            type: 'repository',
            title: repo.name,
            description: repo.description,
            url: repo.url,
            date: repo.lastUpdated,
            tags: repo.languages.map(lang => lang.name)
          })),
          
          ...questions.map(question => ({
            id: `stackoverflow-${question.id}`,
            type: 'stackoverflow',
            title: question.title,
            description: `Score: ${question.score}, Answered: ${question.answered}`,
            url: question.link,
            date: question.createdDate,
            tags: question.tags
          })),
          
          ...posts.map(post => ({
            id: `blog-${post.id}`,
            type: 'blogpost',
            title: post.title,
            description: post.excerpt,
            url: post.link,
            date: post.publishDate,
            tags: post.tags
          }))
        ];
        
        // Apply filters
        let filteredActivities = activities;
        
        // Filter by tags if provided
        if (tags && tags.length > 0) {
          filteredActivities = filteredActivities.filter(activity => 
            activity.tags && activity.tags.some(tag => 
              tags.includes(tag)
            )
          );
        }
        
        // Filter by date if provided
        if (after) {
          const afterDate = new Date(after);
          filteredActivities = filteredActivities.filter(activity => 
            new Date(activity.date) > afterDate
          );
        }
        
        // Sort by date (newest first)
        filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Apply limit
        return filteredActivities.slice(0, limit);
      },
    },
    
    // Type resolvers for complex types
    Repository: {
      languages: async (parent, _, { dataSources }) => {
        if (parent.languages && parent.languages.length > 0) {
          return parent.languages;
        }
        return dataSources.githubAPI.getLanguagesForRepo(parent.name);
      }
    }
};
  
module.exports = resolvers;