import { useQuery } from '@apollo/client';
import { getBookQuery } from '../queries/queries.js'

function BookDetails({ book }) {

  const { loading, error, data } = useQuery(getBookQuery, {
    variables: { id: book || null },
  });

  if ( book === null ) {
    return (
      <div id="book-details">
        <p>Choose a book!</p>
      </div>
    );
  } else {
    if ( data ) {
      let { name, genre, author } = data.book;
      return (
        <div id="book-details">
          <div>
            <h2>{ name }</h2>
            <p>{ genre }</p>
            <p>{ author.name }</p>
            <p>All books by this author:</p>
            <ul className="other-books">
              { author.books.map(b => <li key={b.id}>{b.name}</li>) }
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div id="book-details">
          <p>You chose a book!</p>
        </div>
      );
    }
  }
}

export default BookDetails;
