
import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router';

import { bookContext } from './context.jsx';
import AdminSide from './admin/admin.jsx';
import UserSide from './user/user.jsx';
import Login from './login/login.jsx';
import Register from './login/Register.jsx'
import Forgetlogin from './login/Forgetlogin.jsx'
function App() {
  const [books, setBooks] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addBook = (title, author, genre) => {
    const newBook = {
      id: nextId,
      title,
      author,
      genre,
      borrowedBy: null
    };

    setBooks(prev => [...prev, newBook]);
    setNextId(prev => prev + 1);
  };

  const updateBook = (id, title, author, genre) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === Number(id)
          ? { ...book, title, author, genre }
          : book
      )
    );
  };

  const deleteBook = (id) => {
    setBooks(prev =>
      prev.filter(book => book.id !== Number(id))
    );
  };

  const borrowBook = (bookId, userId) => {
    const book = books.find(
      book => book.id === Number(bookId)
    );

    if (!book) {
      return {
        success: false,
        message: 'Book ID not found.'
      };
    }

    if (!userId.trim()) {
      return {
        success: false,
        message: 'Enter User ID.'
      };
    }

    if (book.borrowedBy !== null) {
      return {
        success: false,
        message: 'Book is already borrowed.'
      };
    }

    setBooks(prev =>
      prev.map(book =>
        book.id === Number(bookId)
          ? { ...book, borrowedBy: userId.trim() }
          : book
      )
    );

    return {
      success: true,
      message: 'Book borrowed successfully.'
    };
  };

  const returnBook = (bookId, userId) => {
    const book = books.find(
      book => book.id === Number(bookId)
    );

    if (!book) {
      return {
        success: false,
        message: 'Book ID not found.'
      };
    }

    if (book.borrowedBy === null) {
      return {
        success: false,
        message: 'Book is not borrowed.'
      };
    }

    if (book.borrowedBy !== userId.trim()) {
      return {
        success: false,
        message: 'User ID does not match borrower.'
      };
    }

    setBooks(prev =>
      prev.map(book =>
        book.id === Number(bookId)
          ? { ...book, borrowedBy: null }
          : book
      )
    );

    return {
      success: true,
      message: 'Book returned successfully.'
    };
  };

  return (
     <bookContext.Provider value={{books,addBook,updateBook,deleteBook,borrowBook,returnBook}}>

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <AdminSide
            />
          }
        />

        <Route
          path="/user"
          element={
            <UserSide
            />
          }
        />

<Route path="/register" element={<Register/>}/>
<Route path="/forgotpassword/forgotpassword" element={<Forgetlogin/>}/>
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
      </bookContext.Provider>
  );
}

export default App;