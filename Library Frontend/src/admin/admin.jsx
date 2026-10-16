
import axios from 'axios';
import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { bookContext } from '../context';
import './admin.css';

function AdminSide() {
  const { books, fetchBooks } = useContext(bookContext);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbncode, setIsbn] = useState('');

  const [editingBook, setEditingBook] = useState(null);
  const navigate= useNavigate();
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    genre: '',
    isbncode: ''
  });

  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // ADD BOOK
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
};
const handleAdd = async (e) => {
  e.preventDefault();

  if (!title.trim() || !author.trim() || !genre.trim() || !isbncode.trim()) {
    setMessage("Please fill in all book details.");
    return;
  }

  try {
    setSaving(true);
    setMessage("");

    // Step 1: Save the book in MongoDB
    const response = await axios.post(
      "http://localhost:3000/addbook",
      {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        isbncode: isbncode.trim(),
      }
    );

    // Step 2: Show successful database save
    setMessage(response.data.message || "Book added successfully.");

    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");

    // Step 3: Refresh the list separately
    try {
      await fetchBooks();
    } catch (refreshError) {
      console.error("Book list refresh error:", refreshError);
      setMessage("Book saved successfully, but refreshing the list failed.");
    }
  } catch (error) {
    console.error("Add book error:", error.response?.data || error.message);

    setMessage(
      error.response?.data?.message || "Failed to add book."
    );
  } finally {
    setSaving(false);
  }
};


  // OPEN UPDATE POPUP
  const openUpdatePopup = (book) => {
    setEditingBook(book);

    setEditForm({
      title: book.title || '',
      author: book.author || '',
      genre: book.genre || '',
      isbncode: book.isbncode || ''
    });

    setMessage('');
  };

  // UPDATE BOOK IN DATABASE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      !editForm.title.trim() ||
      !editForm.author.trim() ||
      !editForm.genre.trim() ||
      !editForm.isbncode.trim()
    ) {
      setMessage('Please fill in all updated details.');
      return;
    }

    try {
      setSaving(true);

      const id = editingBook._id || editingBook.id;

      const updatedData = {
        title: editForm.title.trim(),
        author: editForm.author.trim(),
        genre: editForm.genre.trim(),
        isbncode: editForm.isbncode.trim()
      };

      const response = await axios.put(
        `http://localhost:3000/updatebook/${id}`,
        updatedData
      );

      await fetchBooks();

      setEditingBook(null);

      setMessage(
        response.data.message || 'Book updated successfully.'
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update book.'
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE BOOK FROM DATABASE
  const handleDelete = async (book) => {
    const id = book._id || book.id;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const response = await axios.delete(
        `http://localhost:3000/deletebook/${id}`
      );

      await fetchBooks();

      setMessage(
        response.data.message || 'Book deleted successfully.'
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to delete book.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin_side">
      <h1>Welcome to Library</h1>
      <h2>Admin Dashboard</h2>

      {message && <p className="message">{message}</p>}

      {/* ADD BOOK */}
      <section className="panel">
        <h3>Add Book</h3>

        <form onSubmit={handleAdd}>
          <input
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <input
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />

          <input
            placeholder="ISBN Code"
            value={isbncode}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Please wait...' : 'Add Book'}
          </button>
        </form>
      </section>

      {/* BOOK LIST */}
      <section className="panel">
        <h3>Book List ({books.length})</h3>

        {books.length === 0 ? (
          <p>No books available. Add a book above.</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <div
                className="book-card"
                key={book._id || book.id}
              >
                <h3>{book.title}</h3>

                <p>
                  <strong>Book ID:</strong>{' '}
                  {book._id || book.id}
                </p>

                <p>
                  <strong>Author:</strong> {book.author}
                </p>

                <p>
                  <strong>Genre:</strong> {book.genre}
                </p>

                <p>
                  <strong>ISBN:</strong> {book.isbncode || 'N/A'}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {book.borrowedBy
                    ? `Borrowed by ${book.borrowedBy}`
                    : 'Available'}
                </p>

                <div className="book-actions">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => openUpdatePopup(book)}
                  >
                    Update Book
                  </button>

                  <button
                    type="button"
                    className="danger"
                    disabled={saving}
                    onClick={() => handleDelete(book)}
                  >
                    Delete Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Logout</button>
      </section>

      {/* UPDATE POPUP */}
      {editingBook && (
        <div
          className="update-overlay"
          onClick={() => {
            if (!saving) setEditingBook(null);
          }}
        >
          <div
            className="update-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-popup"
              disabled={saving}
              onClick={() => setEditingBook(null)}
            >
              &times;
            </button>

            <h2>Update Book</h2>

            <p>
              Book ID: {editingBook._id || editingBook.id}
            </p>

            <form onSubmit={handleUpdate}>
              <input
                placeholder="Book Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    title: e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Author"
                value={editForm.author}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    author: e.target.value
                  })
                }
                required
              />

              <input
                placeholder="Genre"
                value={editForm.genre}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    genre: e.target.value
                  })
                }
                required
              />

              <input
                placeholder="ISBN Code"
                value={editForm.isbncode}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    isbncode: e.target.value
                  })
                }
                required
              />

              <div className="popup-actions">
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  disabled={saving}
                  onClick={() => setEditingBook(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSide;
