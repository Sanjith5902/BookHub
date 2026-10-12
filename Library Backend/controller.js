const bookSchema=require('./books.js');
const registerschema=require('./register.js')
const BooksAdd =(req,res)=>{
    const books =new bookSchema({
    bookname:req.body.bookname,
    author:req.body.author,
genre:req.body.genre});
books.save()
.then((result)=>{
    res.status(201).json({
    book:result,
    message: "book added"
});
})
.catch((error)=>{
    console.log(error);
})
}
const Adduser=(req,res)=>{
    const bookuser=new registerschema({
        name:req.body.name,
        number:req.body.number,
        email:req.body.email,
        password:req.body.password,
        confirmpass:req.body.confirmpass
    });
    bookuser.save()
    .then((result)=>{
        res.status(201).json({
    book:result,
    message: "user added"

    });
    })
.catch((error)=>{
    console.log(error);
})

}
const FindBook=(req,res)=>{
    const bookname=req.body.bookname;
    bookSchema.findOne({
        bookname:bookname
    })
    .then((result)=>{
        if(result){
            res.status(200).json({
                book:result,
                message:"book found"
            });
        }else{

              res.status(401).json({
                book:result,
                message:"no book found"
            });
            
        }
    })
    .catch((error) => {
            console.log(error);
        });
}
const UpdateBook = (req, res) => {
    const id = req.params.id;

    bookSchema.findByIdAndUpdate(
        id,
        {
            bookname: req.body.bookname,
            author: req.body.author,
            genre: req.body.genre
        },
        { new: true}
    )
    .then((result) => {
        if (result) {
            res.status(200).json({
                book: result,
                message: "book updated successfully"
            });
        } else {
            res.status(404).json({
                message: "book not found"
            });
        }
    })  
    .catch((error) => {
        console.log(error);
    });
};

const DeleteBook = (req, res) => {
    const id = req.params.id;

    bookSchema.findByIdAndDelete(id)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    book: result,
                    message: "book deleted successfully"
                });
            } else {
                res.status(404).json({
                    message: "book not found"
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

const BorrowBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.body.userid;

        const alreadyBorrowed = await bookSchema.findOne({
            borrowedBy: userId
        });

        if (alreadyBorrowed) {
            return res.status(400).json({
                message: "You must return your current book before taking another book",
                book: alreadyBorrowed
            });
        }

        const book = await bookSchema.findById(bookId);
        book.borrowedBy = userId;
        await book.save();
        res.status(200).json({
            book: book,
            message: "Book borrowed successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};
const ReturnBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.body.userid;

        const book = await bookSchema.findById(bookId);

        if (!book.borrowedBy) {
            return res.status(400).json({
                message: "This book is not borrowed"
            });
        }
        book.borrowedBy = null;

        await book.save();

        res.status(200).json({
            book: book,
            message: "Book returned successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};
module.exports = {
    BooksAdd,
    FindBook,
    UpdateBook,
    DeleteBook,
    BorrowBook,
    ReturnBook,
    Adduser
};

