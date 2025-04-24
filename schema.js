const { gql } = require('apollo-server');

const typeDefs = gql`
  # Common type for unified activity timeline
  type Activity {
    id: ID!
    type: String!  # "repository", "stackoverflow", "blogpost"
    title: String!
    description: String
    url: String!
    date: String!
    tags: [String!]
  }

  # GitHub types
  type Language {
    name: String!
    percentage: Float!
  }

  type Repository {
    id: ID!
    name: String!
    description: String
    url: String!
    stars: Int!
    forks: Int!
    languages: [Language!]!
    lastUpdated: String!
  }

  input RepoFilter {
    language: String
    minStars: Int
    limit: Int
  }

  # Stack Overflow types
  type StackOverflowQuestion {
    id: ID!
    title: String!
    link: String!
    score: Int!
    tags: [String!]!
    answered: Boolean!
    createdDate: String!
  }

  input SOFilter {
    tag: String
    answered: Boolean
    limit: Int
  }

  # Blog types
  type BlogPost {
    id: ID!
    title: String!
    link: String!
    publishDate: String!
    excerpt: String!
    tags: [String!]!
  }

  input BlogFilter {
    tag: String
    limit: Int
  }

  # Queries
  type Query {
    # GitHub queries
    repositories(filter: RepoFilter): [Repository!]!
    repository(id: ID!): Repository
    
    # Stack Overflow queries
    stackOverflowQuestions(filter: SOFilter): [StackOverflowQuestion!]!
    stackOverflowQuestion(id: ID!): StackOverflowQuestion
    
    # Blog queries
    blogPosts(filter: BlogFilter): [BlogPost!]!
    blogPost(id: ID!): BlogPost
    
    # Combined queries
    allActivity(tags: [String], after: String, limit: Int): [Activity!]!
  }
`;

module.exports = typeDefs;