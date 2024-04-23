const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let formData = []; // This will hold our form submissions

app.get('/', (req, res) => {
    let tableHTML = generateTableHTML(formData);
    res.send(`
        <html>
        <body>
          <form action="javascript:void(0);" method="post" id="personForm">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>

            <label for="DOB">Date of Birth</label>
            <input type="date" id="date" name="date" required>

            <label for="DOB">Sex</label>
            <select id="sex">
              <option value="0">Male</option>
              <option value="1">Female</option>
              <option value="2">Intersex</option>
            </select>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>

            <input type="submit" value="Submit">
          </form>
          ${tableHTML}
        </body>
        </html>
    `);
});

app.post('/submit-form', (req, res) => {
    // Extract form data from the request
    const userData = [
        req.body.name,
        req.body.date,
        req.body.sex,
        req.body.email
    ];

    formData.push(userData); // Add the data to our array

    // Redirect to the home page which will now include the new data in the table
    res.redirect('/');
});