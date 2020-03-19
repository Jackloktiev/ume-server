const Express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");


const MealsData = require("./testContent");
const RestData = require("./testRestaurants");


//Ctrs+Shift+[ to collapse the code and Ctrl+Shift+] to unfold

const App = Express();
App.use(bodyParser.urlencoded({extended:true}));
App.use(Express.json());
App.use(session({
    secret:"Bla Bla Bla",
    resave:false,
    saveUninitialized:false
}));
App.use(passport.initialize()); // initialize passposrt
//App.use(passport.session()); // this thing is responsible for creating sessions

//---Set up Data Base---
mongoose.connect("mongodb://localhost:27017/UmeDB2",{ useNewUrlParser: true,  useUnifiedTopology: true });

//--Define User collection--
const userShema = new mongoose.Schema ({
    username: String,
    name: String,
    password: String,
    gender: String,
    age:Number,
    height:Number,
    weight:Number,
    lvlOfActivity:String,
    consumption:Array,
    normCalories:Number,
    normFats:Number,
    normProteins:Number,
    normCarbs:Number
});
userShema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userShema);
// Attach passport to User
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//--Define collection of food and drinks--
const itemShema = new mongoose.Schema ({
    id:Number,
    category:String,
    restaurant:String,
    name:String,
    imageUrl:String,
    caloriesPer100g:Number,
    fatsPer100g:Number,
    carbsPer100g:Number,
    proteinsPer100g:Number
});
const Item = mongoose.model("Item",itemShema);

//--Define restaurant collection--
const restaurantShema = new mongoose.Schema({
    name:String,
    logoUrl:String
});
const Restaurant = mongoose.model("Restaurant",restaurantShema);


//---Define routes---
//--get entire collection of food--
App.get("/food",function(req,res){
    Item.find({},function(err,foundItems){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.send(foundItems);
        }
    });
});
//--get collection of restaurants--
App.get("/restaurants",function(req,res){
    // res.send(RestData);
    Restaurant.find({},function(err,foundItems){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.send(foundItems);
        }
    });
});
//--route to get userData--
App.get("/userData", function(req,res){
    const token = req.query.token;
    const decoded = jwt.verify(token,"top secret");
    let username = decoded.user.username;
    User.findOne({username:username},function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            let now = new Date();
            let today = now.getMonth()+"-"+now.getDate()+"-"+now.getFullYear();
            let totalCalories = 0;
            let totalFats = 0;
            let totalProteins = 0;
            let totalCarbs = 0;
            foundUser.consumption.map((item)=>{
                if(item.date === today){
                    totalCalories = totalCalories + item.calories;
                    totalProteins = totalProteins + item.proteins;
                    totalFats = totalFats + item.fats;
                    totalCarbs = totalCarbs + item.carbs;
                }
            })
            let userData = {
                normCalories:foundUser.normCalories,
                normFats:foundUser.normFats,
                normProteins:foundUser.normProteins,
                normCarbs:foundUser.normCarbs,
                totalCalories:totalCalories,
                totalProteins:totalProteins,
                totalFats:totalFats,
                totalCarbs:totalCarbs        
            }
            res.send(userData);
        }
    })
    
})

//--register a user--
App.post("/register", function(req,res){
    console.log(req.body.username);
    console.log(req.body.password);
    User.register({username:req.body.username},req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                console.log("user created");
                res.send("user created ok");
            })
        }
    })
})

//--login user--
App.post("/login", function(req,res){
    const user = new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                const body = {userID:user._id, username:user.username} // not sure what is this, but done according to the article
                const token = {
                    token:jwt.sign({user:body},"top secret"),
                    username: user.username
                };
                res.json({token});
                console.log(token);
            })
        }
    })
})

App.post("/consumed", function(req,res){
    //Calculate consumption of nutrients depending on amount of food
    let cal = req.body.calories/100*req.body.quantity;
    let prot = req.body.proteins/100*req.body.quantity;
    let carbs = req.body.carbs/100*req.body.quantity;
    let fat = req.body.fats/100*req.body.quantity;

    const token = req.body.token;
    const decoded = jwt.verify(token,"top secret");
    let username = decoded.user.username;

    var meal = {
        date:req.body.date,
        calories:cal,
        fats:fat,
        carbs:carbs,
        proteins:prot,
        amount:req.body.quantity,
        name: req.body.name
    }

    //console.log(meal);
    User.updateOne({username:username},{$push:{consumption:meal}},function(err){
        if(err){
            console.log(err);  //rethink
            res.send("Ooops!");  //rethink
        }else{
            console.log("meal has been added") //rethink
            res.send("meal added")  //rethink
        }
    });
})
//--set user data/profile
App.post("/setUserData", function(req,res){
    console.log(req.body);


    function proteinNorm (weight,activity){
        var norm = 0;
        if(activity==="low"){
            norm = parseFloat(weight);
        }else if(activity==="sport"){
            norm = parseFloat(weight)*1.6;
        }else{
            norm = parseFloat(weight)*1.3;
        }
        return norm;
    };

    function carbsNorm (weight,activity){
        var norm = 0;
        if(activity==="low"){
            norm = parseFloat(weight)*3;
        }else if(activity==="sport"){
            norm = parseFloat(weight)*5;
        }else{
            norm = parseFloat(weight)*6;
        }
        return norm;
    };
    function fatsNorm (weight){
        var norm = parseFloat(weight)*0.8;
        return norm;
    };

    function BMR (gender,weight,height,age){
        var BMR = 0;
        if(gender==="male"){
            BMR = (10*parseFloat(weight))+(6.25*parseFloat(height))-(5*parseFloat(age))+5;
            return BMR;
        }else if(gender==="female"){
            BMR = (10*parseFloat(weight))+(6.25*parseFloat(height))-(5*parseFloat(age))-161;
            return BMR;
        }else{
            return BMR = 0;
        }
    };

    function AMR(levelOfActivity){
        if(levelOfActivity==="low"){
            return 1.2;
        }else if(levelOfActivity==="moderate"){
            return 1.375;
        }else if(levelOfActivity==="average"){
            return 1.55;
        }else if(levelOfActivity==="high"){
            return 1.725;
        }else if(levelOfActivity==="sport"){
            return 1.9;
        }else{
            return 0;
        }
    };

    var userName = req.body.username;
    var name = req.body.name;
    var userGender = req.body.gender;
    var userAge = req.body.age;
    var userHeight = req.body.height;
    var userWeight = req.body.weight;
    var userActivity = req.body.activity;
    var normCalories = BMR(req.body.gender,req.body.weight,req.body.height,req.body.age)*AMR(req.body.activity);
    var normFats = fatsNorm(req.body.weight);
    var normProteins = proteinNorm(req.body.weight, req.body.activity)
    var normCarbs = carbsNorm(req.body.weight, req.body.activity)

    User.updateOne({username:userName},{
        gender:userGender,
        name:name,
        age:userAge,
        height:userHeight,
        weight:userWeight,
        lvlOfActivity:userActivity,
        normCalories:normCalories,
        normFats:normFats,
        normProteins:normProteins,
        normCarbs:normCarbs
        },
        function(err){
            if(!err){
                res.send("user info updated");
            }else{
                res.send(err);
            }
        }
    );

});




//-Service route - add one food item
App.post("/addFoodItem", function(req,res){
    var itemID = 0;
    var itemCategory = req.body.category;
    var itemRestaurant = req.body.restaurant;
    var itemName = req.body.name;
    var itemImageUrl = req.body.imageUrl;
    var itemCalories = req.body.calories;
    var itemFats = req.body.fats;
    var itemCarbs = req.body.carbs
    var itemProteins = req.body.proteins
        
    const foodItem = new Item ({
        id: itemID,
        category: itemCategory,
        restaurant: itemRestaurant,
        name: itemName,
        imageUrl: itemImageUrl,
        caloriesPer100g: itemCalories,
        fatsPer100g: itemFats,
        carbsPer100g: itemCarbs,
        proteinsPer100g: itemProteins
    })
    foodItem.save(function(err){
        if(err){
            console.log(err);
            res.send("Error on adding food item");
        }else{
            console.log("food item added sucesfully");
            res.send("Food item added sucesfully!");
        }
    });
})

//-Service route - add several food items provided in MealsData array
App.post("/addFoodItems", function(req,res){
    MealsData.map(item=>{
    var itemID = item.id;
    var itemCategory = item.category;
    var itemRestaurant = item.restaurant;
    var itemName = item.name;
    var itemImageUrl = item.imageUrl;
    var itemCalories = item.caloriesPer100g;
    var itemFats = item.fatsPer100g;
    var itemCarbs = item.carbsPer100g;
    var itemProteins = item.proteinsPer100g;
        
    const foodItem = new Item ({
        id: itemID,
        category: itemCategory,
        restaurant: itemRestaurant,
        name: itemName,
        imageUrl: itemImageUrl,
        caloriesPer100g: itemCalories,
        fatsPer100g: itemFats,
        carbsPer100g: itemCarbs,
        proteinsPer100g: itemProteins
    })
    foodItem.save(function(err){
        if(err){
            console.log(err);
            res.send("Error on adding food item");
        }else{
            console.log("food item added sucesfully");
            res.send("Food item added sucesfully!");
        }
    });

})

})



App.listen(8000, ()=> console.log("Server is running on port 8000"));