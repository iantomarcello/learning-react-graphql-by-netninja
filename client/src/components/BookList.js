import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getBooksQuery } from '../queries/queries.js'
import BookDetails from './BookDetails';

function BookList() {
  const [ book, setBook ] = useState(null);
  const { loading, error, data } = useQuery(getBooksQuery);

  if ( loading ) return <p>Loading...</p>;
  if ( error ) return <p>Error :(</p>;

  return (
    <div id="main">
      <ul id="book-list">
        { data.books.map(book => <li key={book.id} onClick={(ev) => setBook(book.id)}>{book.name}</li>) }
      </ul>
      <BookDetails book={book}/>
    </div>
  );
}

export default BookList;
