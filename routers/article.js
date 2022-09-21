const express = require('express');
const router  = express.Router();
const Article = require('../models/article')

router.get('/new',(req, res) => {
    res.render("articles/new",{article:new Article()})
})

router.get('/edit/:id',async(req,res)=>{
   const article =await Article.findById(req.params.id)
   res.render('articles/edit',{article:article})

})

router.get('/:slug',async(req, res) => {
 const article =await Article.findOne({slug:req.params.slug})
 // Debug: you should use the "findOne" instead of the "find"
 // cause it will return to array which can not get the property of the article correctly
 // (but if you want to change all the article into a array .. That is your choice :) )
 if(!article)res.redirect('/')
 res.render('articles/show',{article:article})
})
router.post('/',async (req, res,next) => {
 req.article = new Article()
 next()
},saveAndRedirect('new'))
//Why we want to create the delete function 
// cause before we create a slug for each page.
// we now using the slug as a parameter for reading the page
// so we should delete that the former passege which use the "id" for params before
router.delete("/:id",async(req,res)=>{
   await Article.findByIdAndDelete(req.params.id)
   res.redirect("/")
   //we should use id? How about the after page using slug?
   //cause all the article page comes out with its unique id.
   // so the id is definitely could be used for every single page
})
router.put('/:id',async(req,res,next)=>{
req.article = await Article.findById(req.params.id)
next()
},saveAndRedirect('edit'))

function saveAndRedirect(path){
   return async(req,res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
     try{
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
     }
      catch(e){
         console.log(e.message)
         res.render(`articles/${path}`,{article:article})
      }

   }
}

module.exports = router