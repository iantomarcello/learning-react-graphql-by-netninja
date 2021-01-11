import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { getAuthorsQuery, getBooksQuery, addBookMutation } from '../queries/queries.js'

function AddBook() {
  const [ name, setName ] = useState('');
  const [ genre, setGenre ] = useState('');
  const [ author, setAuthor ] = useState(0);

  useEffect(() => {
    console.table(name, genre, author);
  });

  function handleSubmit(ev) {
    ev.preventDefault();
    console.table(name, genre, author);
    addBook({
      variables: { name, genre, author, },
      refetchQueries: [{ query: getBooksQuery }]
    });
  }

  const { loading, error, data } = useQuery(getAuthorsQuery);
  const [ addBook, { data2 } ] = useMutation(addBookMutation);

  if ( loading ) return <p>Loading...</p>;
  if ( error ) return <p>Error :(</p>;

  return (
    <form id="add-book" onSubmit={(ev) => handleSubmit(ev)}>
      <div className="field">
        <label>Book name:</label>
        <input type="text" onInput={(ev) => setName(ev.target.value) }/>
      </div>
      <div className="field">
      <label>Genre:</label>
        <input type="text" onInput={(ev) => setGenre(ev.target.value) }/>
      </div>
      <div className="field">
        <label>Author:</label>
        <select onInput={(ev) => setAuthor(ev.target.value) }>
          <option>Select author</option>
          { data.authors.map(author => <option key={ author.id } value={author.id}>{ author.name }</option>) }
        </select>
      </div>
      <button>+</button>
  </form>
  );
}

export default AddBook;
