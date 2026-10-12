
const express = require('express');
const app = express();
const port = 3000;

const {
    BooksAdd,
    FindBook,
    UpdateBook,
    DeleteBook,
    BorrowBook,
    ReturnBook,
    Adduser
} = require('./controller.js');

require('./db.js');
app.use(require("cors")())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to library');
});

app.post('/register', Adduser);
app.post('/addbook', BooksAdd);
app.post('/findbook', FindBook);
app.put('/updatebook/:id', UpdateBook);
app.delete('/deletebook/:id', DeleteBook);
app.post('/borrowbook/:id', BorrowBook);
app.put('/returnbook/:id', ReturnBook);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
