
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProtectedRoute from "./ProtectedRoute.jsx";
import {
  Routes,
  Route,
  Navigate
} from "react-router";

import { bookContext } from "./context.jsx";
import AdminSide from "./admin/admin.jsx";
import UserSide from "./user/user.jsx";
import Login from "./login/login.jsx";
import Register from "./login/Register.jsx";
import Forgetlogin from "./login/Forgetlogin.jsx";

const PEL = (props) => (
  <div id="hello">
    {props.children}
  </div>
);

function App() {
  const [books, setBooks] = useState([]);

  // Fetch books from MongoDB
  const fetchBooks = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:3000/findbook"
    );

    setBooks(response.data);
  }, []);

  useEffect(() => {
    fetchBooks().catch((error) => {
      console.error("Failed to fetch books:", error);
    });
  }, [fetchBooks]);

  // Add book to MongoDB
  const addBook = async (bookData) => {
    const response = await axios.post(
      "http://localhost:3000/addbook",
      bookData
    );

    await fetchBooks();
    return response.data;
  };

  // Update book in MongoDB
  const updateBook = async (id, bookData) => {
    const response = await axios.put(
      `http://localhost:3000/updatebook/${id}`,
      bookData
    );

    await fetchBooks();
    return response.data;
  };

  // Delete book from MongoDB
  const deleteBook = async (id) => {
    const response = await axios.delete(
      `http://localhost:3000/deletebook/${id}`
    );

    await fetchBooks();
    return response.data;
  };

  // Borrow book
  const borrowBook = async (bookId, userId) => {
    const response = await axios.post(
      `http://localhost:3000/borrowbook/${bookId}`,
      { userId }
    );

    await fetchBooks();
    return response.data;
  };

  // Return book
  const returnBook = async (bookId, userId) => {
    const response = await axios.put(
      `http://localhost:3000/returnbook/${bookId}`,
      { userId }
    );

    await fetchBooks();
    return response.data;
  };

  return (
    <bookContext.Provider
      value={{
        books,
        fetchBooks,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook
      }}
    >
      <Routes>
        <Route
          path="/"
          element={<PEL><Login /></PEL>}
        />

        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminSide />
    </ProtectedRoute>
  }
/>

<Route
  path="/user"
  element={
    <ProtectedRoute allowedRole="user">
      <UserSide />
    </ProtectedRoute>
  }
/>
        <Route path="/register" element={<Register />} />

        <Route
          path="/forgotpassword/forgotpassword"
          element={<Forgetlogin />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </bookContext.Provider>
  );
}

export default App;
