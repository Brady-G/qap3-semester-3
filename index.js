const express = require('express');
const methodOverride = require('method-override');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, }));
app.use(methodOverride('_method'));

app.use("/api", require('./routes/api'))

app.get('/', (req, res) => {
    const type = req.query.register === "true"
    res.render('index.ejs', { type: type ? "register" : "login" });
});

const ejsRoute = (name) => app.get(`/${name}`, (req, res) => {
    res.render(`${name}.ejs`)
});

ejsRoute("home")
ejsRoute("account")

app.listen(3000, () => {
    console.log("Sever listening on port 3000")
});