
import { useState,useContext } from 'react';
import {NavLink} from 'react-router';
import { bookContext } from '../context';
import './admin.css';
function AdminSide() {
  const{books,
  addBook,
  updateBook,
  deleteBook}=useContext(bookContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const [bookId, setBookId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('');

  const [message, setMessage] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !genre.trim()) {
      setMessage('Please fill in all book details.');
      return;
    }

    addBook(title.trim(), author.trim(), genre.trim());

    setTitle('');
    setAuthor('');
    setGenre('');
    setMessage('Book added successfully.');
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const book = books.find(
      b => b.id === Number(bookId)
    );

    if (!book) {
      setMessage('Book ID not found.');
      return;
    }

    if (
      !newTitle.trim() ||
      !newAuthor.trim() ||
      !newGenre.trim()
    ) {
      setMessage('Enter all the updated details.');
      return;
    }

    updateBook(
      bookId,
      newTitle.trim(),
      newAuthor.trim(),
      newGenre.trim()
    );

    setBookId('');
    setNewTitle('');
    setNewAuthor('');
    setNewGenre('');
    setMessage('Book updated successfully.');
  };

  const handleDelete = (id) => {
    deleteBook(id);
    setMessage(`Book ID ${id} deleted.`);
  };

  return (
    <>
     <div className="admin_side">
      <h1>Welcome to Library</h1>
      <h2>Admin Dashboard</h2>

      {message && <p className="message">{message}</p>}

      <div className="form-grid">
        <section className="panel">
          <h3>Add Book</h3>

          <form onSubmit={handleAdd}>
            <input
              placeholder="Book Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <input
              placeholder="Author"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />

            <input
              placeholder="Genre"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            />

            <button type="submit">Add Book</button>
          </form>
        </section>

        <section className="panel">
          <h3>Update Book</h3>

          <form onSubmit={handleUpdate}>
            <input
              type="number"
              min="1"
              placeholder="Existing Book ID"
              value={bookId}
              onChange={e => setBookId(e.target.value)}
            />

            <input
              placeholder="New Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />

            <input
              placeholder="New Author"
              value={newAuthor}
              onChange={e => setNewAuthor(e.target.value)}
            />

            <input
              placeholder="New Genre"
              value={newGenre}
              onChange={e => setNewGenre(e.target.value)}
            />

            <button type="submit">Update Book</button>
          </form>
        </section>
      </div>

      <section className="panel">
        <h3>Book List ({books.length})</h3>

        {books.length === 0 ? (
          <p>No books available. Add a book above.</p>
        ) : (
          <div className="book-grid">
            {books.map(book => (
              <div className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p><strong>Book ID:</strong> {book.id}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  {book.borrowedBy
                    ? `Borrowed by ${book.borrowedBy}`
                    : 'Available'}
                </p>

                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete Book
                </button>
              </div>
            ))}
          </div>
        )}                                    
        <NavLink to="/" className="logout-button">
          Logout
        </NavLink>
      </section>
      </div>
    </>
  );
}

export default AdminSide;