var PORT = process.env.PORT || 3000;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require('method-override');
var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect('mongodb+srv://dcra:dcra123456789@cluster0-vynbh.mongodb.net/test?retryWrites=true&w=majority', {
  	useNewUrlParser: true,
	useCreateIndex: true
})

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR!");
    } else {
      res.render("index.ejs", { blogs: blogs });
    }
  });
});

app.get('/blogs/new', function(req,res){
	res.render('new.ejs');
});

app.post('/blogs', function(req,res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render('new.ejs');
		} else {
			res.redirect('/blogs');
		}
	});
});

app.get('/blogs/:id', function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect('/blogs');
		} else {
			res.render('show.ejs', {blog: foundBlog });
		}
	});
});

app.get('/blogs/:id/edit', function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect('/blogs');
		} else {
			res.render('edit.ejs', {blog: foundBlog })
		}
	});
});

app.put('/blogs/:id', function(req,res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, uppdatedBlog){
		if(err){
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

app.delete('/blogs/:id', function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});

app.listen(PORT, function() {
  console.log("The server has started...");
});
