const express = require('express')
const app = express();
const articleRouter = require('./routers/article')
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost/blog',()=>{
    console.log("connected!")
})

//添加中间件
const logger = (req, res, next) => {
    console.log(req.originalUrl);
    next()
}
app.set("view engine", "ejs");
app.use(logger)
app.get("/",async (req, res) => {
    // const articles = [{
    //     title:"Test Article",
    //     createAt : new Date(),
    //     description:"Test description",
    // },
    // {
    //     title:"Test Article2",
    //     createAt :new Date(),
    //     description:"Test description",
    // }]
    const articles = await Article.find().sort({createAt:"desc"})
    
    res.render("articles/index",{articles:articles})
})

app.use("/articles",articleRouter)
app.listen(5000)

