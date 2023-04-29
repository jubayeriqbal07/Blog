// IMPORTINGS
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const NodeCache = require('node-cache');
const {
    dsc_pretify
} = require("./utils.js");


/* mongodb+srv://iqbaljubayer8:wpzkHKA64VUlI7mp@ventron.d0kxyl4.mongodb.net/test */
/* wpzkHKA64VUlI7mp */

const dbServer = "mongodb+srv://iqbaljubayer8:wpzkHKA64VUlI7mp@ventron.d0kxyl4.mongodb.net/BLOG"

const app = express()
const port = 8080;
mongoose.connect(dbServer).then((element)=>{
    console.log("Connetction Established!");
}).catch(()=>{
    console.log("Connetction Failed!");
})
const myCache = new NodeCache()

app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// DATABASE COLLECTIONS
const postsSchema = new mongoose.Schema({
    usr_: String,
    title: String,
    desc: String
})
const POSTS = mongoose.model("posts", postsSchema);

const userSchecma = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
});
const USER = mongoose.model('users', userSchecma);

// ENDPOINTS
app.get('/', (req, res) => {
    POSTS.find().then(function (document) {
        document.forEach(element => {
            element.desc = dsc_pretify(element.desc);
        })
        params = {
            contents: document,
            isSignedIn: myCache.has('uniqueKey')
        };
        res.render('index', params)
    })
})

function load_contents() {
    POSTS.find().then(function (document) {
        document.forEach(element => {
            app.get(`/posts/${element._id}`, (req, res) => {
                desc_ = dsc_pretify(element.desc);
                params = {
                    content: {
                        title: element.title,
                        usr_: element.usr_,
                        desc: desc_
                    },
                    isSignedIn: myCache.has('uniqueKey')
                }
                res.render('posts', params)
            })
        })
    })
}

load_contents();


app.get("/createPost", (req, res) => {
    if (myCache.has('uniqueKey')) {
        res.render('createPost', params = {
            isSignedIn: myCache.has('uniqueKey')
        });
    } else {
        res.status(404);
        res.send("<h1>ERROR 404</h1>");
    }
})

app.post("/createPost", (req, res) => {
    post_usr = myCache.get('uniqueKey');
    post_title = req.body.post_title;
    post_desc = req.body.desc;
    POSTS.insertMany([{
        usr_: post_usr,
        title: post_title,
        desc: post_desc
    }]);
    load_contents();
    res.redirect('/');
})



app.get('/signIn', (req, res) => {
    res.render('signIn', params = {
        incorrect: false
    });
})

app.post('/signIn', (req, res) => {
    usr_found = false;
    usr_pass_corr = false;
    USER.find({
        email: req.body.usr_email
    }).then(element => {
        if (element.length > 0 && element[0].password == req.body.usr_pass) {
            myCache.set('uniqueKey', req.body.usr_email);
            res.redirect("/");
        } else {
            res.render('signIn', params = {
                incorrect: true
            });
        }
    })
})

app.get('/signUp', (req, res) => {
    res.render('signUp', params = {
        accExist: false
    });
})

app.post('/signUp', (req, res) => {
    usr_fullname = req.body.usr_fullname;
    usr_email = req.body.usr_email;
    usr_pass = req.body.usr_pass;
    USER.find({
        email: usr_email
    }).then(element => {
        if (element.length > 0) {
            res.render('signUp', params = {
                accExist: true
            });
        } else {
            USER.insertMany([{
                fullname: usr_fullname,
                email: usr_email,
                password: usr_pass
            }]);
            myCache.set('uniqueKey', usr_email);
            res.redirect('/');
        }
    })
})

app.get('/signOut', (req, res) => {
    if (myCache.has('uniqueKey')) {
        myCache.del('uniqueKey');
        res.redirect('/')
    } else {
        res.redirect('/')
    }
})


// START THE SERVER
app.listen(port, () => {
    console.log(`This application is running on port: ${port}`);
})