const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const registerschema=require('./register.js')
const bookSchema =require("./books.js")
const Book = require("./books.js");



const addBook = async (req, res) => {
  try {
    console.log("Received book data:", req.body);

    const book = await Book.create(req.body);

    return res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("Add book error:", error.message);

    return res.status(500).json({
      message: error.message || "Failed to add book",
    });
  }
};

// Get All Books
const findBook = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginuser=async (req, res) => {
    try {

        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { email, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({
                message: "Admin login successful",
                token,
                role: "admin"
            });
        }

        const user = await registerschema.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
       const username = req.body.name;
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: "user",
                username:user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            role: "user"
        });

    } catch (error) {
    console.log("Login error:", error);
    console.log("Backend response:", error.response?.data);

    setMessage(
        error.response?.data?.message ||
        error.message ||
        "Unable to login"
    );
}
};
const Adduser=async(req,res)=>{
    try{
        const{
            user,name,number,email,password
        }=req.body
        const existinguser= await registerschema.findOne({email});
        if(existinguser){
            return res.status(201).json({
                message:"user already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
           const newUser = new registerschema({
            name,
            number,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(200).json({
            message:"user registered"
        })
    }catch(error){
        return res.status(500).json({
            message:"registeration failed",
            error:error.message
        })
        

    }
   


}


const BorrowBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.body.userId;


        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Check whether this user already has a borrowed book
        const alreadyBorrowed = await bookSchema.findOne({
            borrowedBy: userId
        });

        if (alreadyBorrowed) {
            return res.status(400).json({
                message: "Return your current book before borrowing another book",
                book: alreadyBorrowed
            });
        }

        // Find the requested book
        const book = await bookSchema.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Check whether another user has borrowed this book
        if (book.borrowedBy) {
            return res.status(400).json({
                message: "This book is already borrowed"
            });
        }

        book.borrowedBy = userId;
        await book.save();

        return res.status(200).json({
            book,
            message: "Book borrowed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};


const ReturnBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const book = await bookSchema.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (!book.borrowedBy) {
            return res.status(400).json({
                message: "This book is not borrowed"
            });
        }

        // Only the borrower can return this book
        if (book.borrowedBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You cannot return a book borrowed by another user"
            });
        }

        book.borrowedBy = null;
        await book.save();

        return res.status(200).json({
            book,
            message: "Book returned successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};

module.exports = {
    addBook,
    findBook,
    updateBook,
    deleteBook,
    BorrowBook,
    ReturnBook,
    Adduser,
    loginuser
};

