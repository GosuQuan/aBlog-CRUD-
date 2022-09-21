const mongoose = require("mongoose");
const {marked}  = require("marked")
const slugify = require("slugify"); 
const createDomPurify = require("DomPurify");
const {JSDOM} = require("jsdom")
const dompurify = createDomPurify(new JSDOM().window)
//why import the slugify? 其实我也不知道slugify到底是啥意思，反正是为了简化url的一个库
//the id behind every single page is to ugly.And we tried to make it easier 
// to understand every meaning of the url
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  slug:{
    type:String,
    required:true,
    unique: true,//the circumstance the same as the id
  },
  sanitizedHtml: {
    type:String,
    required:true,
  }
});

articleSchema.pre("validate",function(next){
    if(this.title){
        this.slug = slugify(this.title,{lower:true,strict:true})
    }
    
    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model("Article", articleSchema);
