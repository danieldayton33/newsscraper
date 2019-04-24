const express = require('express');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const logger = require('morgan');
const axios = require('axios');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//setup handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



const db = require('./models');

if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else{
    mongoose.connect("mongodb://localhost/newscraper", {useNewUrlParser: true});
}


app.get("/scrape", (req, res)=> {
    axios.get("https://beachgrit.com/").then(response => {
    const $ = cheerio.load(response.data);
    $("article ").each((i, element) => {
        const description = $(element).find("p").text();
        console.log('DESCRIPTION', description)
        let title = $(element).find('h2').text();
        let link = $(element).find('a').attr('href');
        let imageSrc = $(element).find('.bg-img').attr('data-src');
        console.log("TITLE", title);
        console.log("LINK", link)
        console.log("IMAGE", imageSrc);
        const result = {};
        result.title = title;
        result.link = link;
        result.description = description;
        result.imageSrc = imageSrc;
        
        db.Article.create(result)
        .then(result => {
            res.json("Scrape Finished!")
        })
        .catch(err => {
            console.log(err);
       
            });
        });
    });
});



app.get("/saved", (req, res) => {
    db.Article.find({isSaved: "true"})
    .then(result => {
        const handleBarObj = {articles: result};
        res.render('saved', handleBarObj)
    }).catch(err =>
        res.json(err));
})
app.get("/", (req, res) => {
    db.Article.find({isSaved:"false"}).then(result => {
        const articles = {
            articles: result
        }
        res.render('index', articles)
    })
});
//find Notes for Modal
app.get("/notes/:id", (req,res) => {
    console.log("REQPARAMS", req.params.id);
    db.Article.findOne({"_id":req.params.id})
    .populate('notes')
    .then(result => {
        result.hasNote = true;
        console.log("RESULT", result);
        res.json(result);
    })
});

app.get("/drop", (req, res) => {
    db.Article.remove({})
    .then(result => {
        res.json("You've deleted the articles")
    })
    .catch(err =>
        res.json(err)
        );
})

app.put("/save/:id", (req, res) => {
    console.log("REQBODY SAVE ARTICLE", req.body)
    const sentFrom = req.body.sentFrom
    const searchObj = {_id: req.params.id};
    console.log("SEARCHOBJ", searchObj);
    if(sentFrom === "index") {
        db.Article.findOneAndUpdate(searchObj, {isSaved: req.body.isSaved}, {new: true})
        .then(result => {
            console.log("RESULT", result);    
            db.Article.find({isSaved: "false"})
                .then(result => {
                console.log('ISSAVED FALSE', result)
                const articles = {
                articles: result
                    }
                res.render('index', articles);
            });
        }).catch(err => {
            res.json(err);
        });
    } 
    else if( sentFrom === "saved") {
        db.Article.findOneAndUpdate(searchObj, {isSaved: req.body.isSaved}, {new: true})
        .then(result => {
                console.log(result);
         db.Article.find({isSaved: "true"})
        .then(result => {
            console.log('ISSAVED True', result)
            const articles = {
                articles: result
            }
                    res.render('saved', articles);
            }).catch(err => {
                res.json(err);
            })
        });
    }
});

//save notes to db.Note and update db.Article with new note id
app.post("/savenote/:id", (req, res) => {
    console.log("REQ.BODY", req.body);
    console.log("REQPARAMS", req.params.id)
    db.Note.create(req.body)
    .then(noteResult => {
        console.log(noteResult);
        return db.Article.findOneAndUpdate({_id:req.params.id}, {$push: {notes:noteResult._id}}, {new: true}).populate('notes')
    })
    .then(artResult => {
        res.json(artResult)
    })
    .catch(err => {
        res.json(err);
    });
});

//update note
app.put("/note/:id", (req, res) => {
    console.log("REQPARAMS", req.params.id);
    console.log("REQBODY", req.body);
    db.Note.findOneAndUpdate({_id:req.body.id}, {body: req.body.body},{new: true})
    .then(noteResult =>{
        console.log("NOTERESULT", noteResult)
        return db.Article.find({_id:req.params.id}).populate("notes")
    })
    .then(artResult => {
        console.log("ARTRESULT", artResult);
        res.json(artResult);
    })
    .catch(err => {
        console.log(err)
    })
});

// app.get("/", (req, res) => {
//     res.
// });

app.listen(PORT, ()=> {
    console.log(`App listening on http://localhost:8080`);
});