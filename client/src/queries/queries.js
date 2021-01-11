import { gql } from '@apollo/client';

const getBookQuery = gql`
  query GetBook($id: ID) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`;

const getBooksQuery = gql`
  {
    books {
      name
      id
      author {
        name
      }
    }
  }
`;

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;

const addBookMutation = gql`
  mutation AddBook($name: String!, $genre: String!, $author: ID!){
    addBook(name: $name, genre: $genre, authorId: $author) {
      name
      genre
    }
  }
`;

export { getBookQuery, getBooksQuery, getAuthorsQuery, addBookMutation, };
