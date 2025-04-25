# Developer Portfolio GraphQL API

A unified GraphQL API that aggregates developer activity from multiple platforms:
- GitHub repositories
- Stack Overflow questions and answers
- Blog posts (from Dev.to or Medium)

## Features

- **Unified Timeline**: Get all your development activity across platforms in one chronological feed
- **Powerful Filtering**: Filter content by technology, tags, or date
- **GraphQL API**: Fetch only the data you need with a single request
- **Caching**: Efficient caching to avoid API rate limits
- **Error Handling**: Robust error handling for API failures

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- API keys for the platforms you want to integrate

### Installation
1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Create a .env file and add your API keys
4. Start the server:
```bash
npm run dev
```

The GraphQL playground will be available at http://localhost:4000

## API Usage Examples
### Fetch GitHub Repositories
```graphql
query {
  repositories {
    id
    name
    description
    url
    stars
    forks
    languages {
      name
      percentage
    }
  }
}
```

### Fetch Stack Overflow Activity
```graphql
query {
  stackOverflowQuestions {
    id
    title
    link
    score
    tags
    answered
  }
}
```

### Fetch Blog Posts
```graphql
query {
  blogPosts {
    id
    title
    link
    publishDate
    excerpt
    tags
  }
}
```

### Fetch Combined Activity Timeline
```graphql
query {
  allActivity(limit: 10) {
    id
    type
    title
    description
    url
    date
    tags
  }
}
```

### Filter By Tags
```graphql
query {
  allActivity(tags: ["JavaScript", "React"]) {
    id
    title
    type
    date
  }
}
```

## Project Structure
```bash
├── server.js             # Main entry point
├── schema.js            # GraphQL schema definition
├── resolvers.js         # GraphQL resolvers
├── datasources/         # API integrations
│   ├── githubAPI.js         # GitHub API integration
│   ├── stackOverflowAPI.js  # Stack Overflow API integration
│   └── blogAPI.js           # Blog API integration
├── utils/               # Utility functions
│   ├── cache.js             # Memory caching utility
│   └── errorHandler.js      # Error handling utilities
```

## Future Enhancements

- **Add authentication**
- **Implement Redis caching for production**
- **Add pagination for large result sets**
- **Create a frontend UI to display the data**
- **Add more data sources (e.g., Twitter, LinkedIn)**

## License

MIT