var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - SHOW ALL CAMPGROUNDS
//campgrounds route
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
            // This was just used when the camps were in an array
            // res.render("campgrounds", {campgrounds: campgrounds});
});

//CREATE - add new campground to DB
//setting up post route
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form an add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name, 
        price: price, 
        image: image,
        description: desc,
        author: author
    };
    // this was when campgrounds was an array
    // campgrounds.push(newCampground);
    
    //Want to create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);     
        } else {
            //redirect back to campgrounds
            res.redirect("/campgrounds");
        }
    });
    
    // was used to redirect back to campgrounds page when campgrounds were in an array
    // res.redirect("/campgrounds");
    
});


//NEW - show form to create new campground
//route to submit new campground 
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});

//SHOW - shows more info on a specific campground
router.get("/:id", function(req, res){
    //find the campground based on the ID provided
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    req.params.id;
    //render the show page associated with that ID
    //   res.render("show") ;
});

//EDIT Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
            //redirect to show page
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;