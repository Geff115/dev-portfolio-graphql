const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();

// Import our data sources
const GitHubAPI = require('./datasources/githubAPI');
const StackOverflowAPI = require('./datasources/stackOverflowAPI');
const BlogAPI = require('./datasources/blogAPI');

// Set up data sources with caching
const dataSources = () => ({
  githubAPI: new GitHubAPI(),
  stackOverflowAPI: new StackOverflowAPI(),
  blogAPI: new BlogAPI()
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: ({ req }) => {
    // We can add authentication context here if needed later
    return {};
  },
  introspection: true,
  playground: true,
  cacheControl: {
    defaultMaxAge: 3600, // 1 hour in seconds
  },
});

const PORT = process.env.PORT || 4000;

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});