import {
  ApolloClient, InMemoryCache, ApolloProvider,
} from '@apollo/client';
import BookList from './components/BookList';
import AddBook from './components/AddBook';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BookList />
      </div>
      <AddBook />
    </ApolloProvider>
  );
}

export default App;
