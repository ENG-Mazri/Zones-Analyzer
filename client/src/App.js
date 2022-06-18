import './App.css';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache
} from "@apollo/client";
import Flats from './components/flats';
import AddFlat from './components/addFlat';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Hello ghraphql</h1>
        <Flats/>
        <AddFlat/>
      </div>
    </ApolloProvider>
  );
}

export default App;
