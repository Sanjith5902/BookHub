
import { useState,useContext } from 'react';
import {NavLink} from 'react-router';
import { bookContext } from '../context';
import './user.css';
function UserSide() {
  const{books, borrowBook, returnBook}=useContext(bookContext);
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const [borrowedDetails, setBorrowedDetails] = useState(null);
  
  const handleBorrow = (e) => {
    e.preventDefault();

    const result = borrowBook(bookId, userId);
    setMessage(result.message);

    if (result.success) {
      setBorrowedDetails({
        bookId: Number(bookId),
        userId: userId.trim(),
        action: 'Borrowed'
      });

      setBookId('');
    }
  };

  const handleReturn = (e) => {
    e.preventDefault();

    const result = returnBook(bookId, userId);
    setMessage(result.message);

    if (result.success) {
      setBorrowedDetails({
        bookId: Number(bookId),
        userId: userId.trim(),
        action: 'Returned'
      });

      setBookId('');
    }
  };

  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase().trim();

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      String(book.id).includes(query)
    );
  });

  const borrowedBooks = books.filter(
    book => book.borrowedBy !== null
  );

  return (
    <>
    <div className="user_side">
      <h1>Welcome to Library</h1>
      <h2>User Dashboard</h2>

      {message && <p className="message">{message}</p>}

      <div className="form-grid">
        <section className="panel">
          <h3>Borrow / Return Book</h3>

          <form onSubmit={handleBorrow}>
            <input
              type="number"
              min="1"
              placeholder="Book ID"
              value={bookId}
              onChange={e => setBookId(e.target.value)}
              required
            />

            <input
              placeholder="User ID"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              required
            />

            <button type="submit">Borrow Book</button>

            <button
              type="button"
              className="secondary"
              onClick={handleReturn}
            >
              Return Book
            </button>
          </form>
        </section>

        <section className="panel">
          <h3>Search Books</h3>

          <input
            type="text"
            placeholder="Search by title, author, genre or ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <p>
            Showing {filteredBooks.length} of {books.length} books.
          </p>
        </section>
      </div>

      <section className="panel">
        <h3>Book List</h3>

        {filteredBooks.length === 0 ? (
          <p>No matching books found.</p>
        ) : (
          <div className="book-grid">
            {filteredBooks.map(book => (
              <div className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p><strong>Book ID:</strong> {book.id}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  {book.borrowedBy
                    ? 'Borrowed'
                    : 'Available'}
                </p>

                {book.borrowedBy && (
                  <div className="borrow-info">
                    <p>
                      <strong>Borrowed by User ID:</strong>{' '}
                      {book.borrowedBy}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Current Borrowing Details ({borrowedBooks.length})</h3>

        {borrowedBooks.length === 0 ? (
          <p>No books are currently borrowed.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>User ID</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {borrowedBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.borrowedBy}</td>
                    <td>
                      <span className="status-borrowed">
                        Borrowed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {borrowedDetails && (
          <p className="message">
            Last action: {borrowedDetails.action} — Book ID{' '}
            {borrowedDetails.bookId}, User ID{' '}
            {borrowedDetails.userId}.
          </p>
        )}
      </section>
       <NavLink to="/" className="logout-button">
          Logout
        </NavLink>
        </div>
    </>
  );
}

export default UserSide;