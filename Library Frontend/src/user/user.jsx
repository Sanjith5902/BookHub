
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { bookContext } from "../context.jsx";
import "./user.css";

function UserSide() {
  const user_name=localStorage.getItem("username")
 const { books, fetchBooks } = useContext(bookContext);
const userName = localStorage.getItem("userName") || "User";
  const [bookId, setBookId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  
const handleBorrow = async (e) => {
  e.preventDefault();

  if (!userId) {
    setMessage("Please log in again.");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const response = await axios.post(
      `http://localhost:3000/borrowbook/${bookId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setMessage(response.data.message || "Book borrowed successfully.");
    setBookId("");
    await fetchBooks();
  } catch (error) {
    setMessage(
      error.response?.data?.message || "Failed to borrow book."
    );
  } finally {
    setLoading(false);
  }
};


  
const handleReturn = async (e) => {
  e.preventDefault();

  if (!bookId) {
    setMessage("Enter a Book ID first.");
    return;
  }

  if (!userId) {
    setMessage("Please log in again.");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const response = await axios.put(
      `http://localhost:3000/returnbook/${bookId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setMessage(response.data.message || "Book returned successfully.");
    setBookId("");
    await fetchBooks();
  } catch (error) {
    setMessage(
      error.response?.data?.message || "Failed to return book."
    );
  } finally {
    setLoading(false);
  }
};


  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      (book.title || "").toLowerCase().includes(query) ||
      (book.author || "").toLowerCase().includes(query) ||
      (book.genre || "").toLowerCase().includes(query) ||
      String(book._id || book.id || "").includes(query)
    );
  });

  // Display books borrowed by this user only.
  // This assumes borrowedBy stores the user's ID as a string.
  const borrowedBooks = books.filter(
    (book) =>
      book.borrowedBy != null &&
      String(
        typeof book.borrowedBy === "object"
          ? book.borrowedBy._id
          : book.borrowedBy
      ) === String(userId)
  );

  return (
  <div className="user_side">
    <nav className="user-navbar">
      <h2 className="brand">BookHub</h2>

      <div className="navbar-right">
        <span className="welcome-user">
          Welcome, {user_name}
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>

    <h1>Welcome to Library</h1>
    <h2>User Dashboard</h2>

    {message && <p className="message">{message}</p>}

      <div className="form-grid">
        <section className="panel">
          <h3>Borrow / Return Book</h3>

          <form onSubmit={handleBorrow}>
            <input
              type="text"
              placeholder="Book MongoDB ID"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Borrow Book"}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={handleReturn}
              disabled={loading}
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredBooks.map((book) => (
              <div className="book-card" key={book._id || book.id}>
                <h3>{book.title}</h3>

                <p>
                  <strong>Book ID:</strong> {book._id || book.id}
                </p>

                <p>
                  <strong>Author:</strong> {book.author}
                </p>

                <p>
                  <strong>Genre:</strong> {book.genre}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {book.borrowedBy ? "Borrowed" : "Available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h3>My Borrowed Books ({borrowedBooks.length})</h3>

        {borrowedBooks.length === 0 ? (
          <p>You have no borrowed books currently.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {borrowedBooks.map((book) => (
                  <tr key={book._id || book.id}>
                    <td>{book._id || book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
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
      </section>

     
    </div>
  );
}

export default UserSide;
