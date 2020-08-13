const Express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const path = require('path');

const MealsData = require("./testContent");
const RestData = require("./testRestaurants");


//Ctrs+Shift+[ to collapse the code and Ctrl+Shift+] to unfold

const App = Express();
App.use(bodyParser.urlencoded({extended:true}));
App.use(Express.json());
App.use(passport.initialize()); // initialize passposrt
App.use(cors());


//---Set up Data Base---
mongoose.connect("mongodb+srv://Jack_Lo:Scarboro2581347@ume.b4s1t.mongodb.net/UmeDB2?retryWrites=true&w=majority",{ useNewUrlParser: true,  useUnifiedTopology: true });

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
    normCarbs:Number,
    consumptionId:Number
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
            res.status(409).send(err);
        }else{
            res.status(200).send(foundItems);
        }
    });
});
//--get collection of restaurants--
App.get("/restaurants",function(req,res){
    // res.send(RestData);
    Restaurant.find({},function(err,foundItems){
        if(err){
            console.log(err);
            res.status(409).send(err);
        }else{
            res.status(200).send(foundItems);
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
            res.status(409).send(err);
        }else{
            let now = new Date();
            let today = now.getMonth()+"-"+now.getDate()+"-"+now.getFullYear();
            let totalCalories = 0;
            let totalFats = 0;
            let totalProteins = 0;
            let totalCarbs = 0;
            if(foundUser.consumption){
                foundUser.consumption.map((item)=>{
                    if(item.date === today){
                        totalCalories = totalCalories + item.calories;
                        totalProteins = totalProteins + item.proteins;
                        totalFats = totalFats + item.fats;
                        totalCarbs = totalCarbs + item.carbs;
                    }
                })
            }else{
                totalCalories = 0;
                totalProteins = 0;
                totalFats = 0;
                totalCarbs = 0;
            }

            let userData = {
                normCalories:foundUser.normCalories,
                normFats:foundUser.normFats,
                normProteins:foundUser.normProteins,
                normCarbs:foundUser.normCarbs,
                totalCalories:totalCalories,
                totalProteins:totalProteins,
                totalFats:totalFats,
                totalCarbs:totalCarbs,
                name:foundUser.name,
                gender:foundUser.gender,
                age:foundUser.age,
                height:foundUser.height,
                weight:foundUser.weight,
                levelOfActivity:foundUser.lvlOfActivity     
            }
            res.status(200).send(userData);
        }
    })
    
})

//--register a user--
App.post("/register", function(req,res){
    User.register({username:req.body.username},req.body.password, function(err,user){
        if(err){
            if(err.name === "UserExistsError"){
                res.status(409).send("User exists");
            }else{
                res.status(500).send("Unknown database error");
            }
        }else{
            passport.authenticate("local")(req,res,function(){
                res.status(200).send("User created");
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
            res.status(409).send(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                const body = {userID:user._id, username:user.username} // not sure what is this, but done according to the article
                const token = {
                    token:jwt.sign({user:body},"top secret"),
                    username: user.username
                };
                res.status(200).json({token});
            })
        }
    })
})

App.post("/consumed", async function(req,res){
    //Calculate consumption of nutrients depending on amount of food
    let cal = req.body.calories/100*req.body.quantity;
    let prot = req.body.proteins/100*req.body.quantity;
    let carbs = req.body.carbs/100*req.body.quantity;
    let fat = req.body.fats/100*req.body.quantity;

    const token = req.body.token;
    const decoded = jwt.verify(token,"top secret");
    let username = decoded.user.username;

    var successIndicator;
    //getting latest consumption id
    var consumptionId;
    await User.findOne({username:username},function(err, foundUser){
        if(err){
            console.log(err);
            successIndicator = false;
        }else{
            console.log(foundUser.consumptionId);
            consumptionId = foundUser.consumptionId;
            successIndicator = true;
        }
    });
    
    var updatedConsumptionId = (consumptionId+1)||0;
    await User.updateOne({username:username},{consumptionId:updatedConsumptionId},function(err){
        if(err){
            console.log(err); 
            successIndicator = false;
        }else{
            successIndicator = true;
        }
    });



    var meal = {
        mealId:updatedConsumptionId,
        date:req.body.date,
        calories:cal,
        fats:fat,
        carbs:carbs,
        proteins:prot,
        amount:req.body.quantity,
        name: req.body.name
    }
    
    //adding user data to consumption array
    User.updateOne({username:username},{$push:{consumption:meal}},function(err){
        if(err){
            console.log(err);
            successIndicator = false;
        }else{
            successIndicator = true;
        }
    });

    if(successIndicator){
        res.status(200).send("Meal added and consumptionId updated");
    }else{
        res.status(409).send("Something went wrong");
    }


})
//--set user data/profile
App.post("/setUserData", function(req,res){

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
                res.status(200).send("user info updated");
            }else{
                res.status(409).send(err);
            }
        }
    );

});

//--get consumption history data--
App.get("/history", function(req,res){
    const token = req.query.token;
    const decoded = jwt.verify(token,"top secret");
    let username = decoded.user.username;
    User.findOne({username:username},function(err, foundUser){
        if(err){
            console.log(err);
            res.status(409).send(err);
        }else{
            var consumption = foundUser.consumption;
            if(consumption){
                res.status(200).send(consumption);
            }else{
                res.status(409).send("no consumption data");
            }
        }
    })
});

//update consumption history data--
App.post("/historyChange", async function(req,res){
    let cal = req.body.calories;
    let prot = req.body.proteins;
    let carbs = req.body.carbs;
    let fat = req.body.fats;
    let id = req.body.mealId;
    let date = req.body.date;
    let amount = req.body.amount;
    let name = req.body.name;

    const token = req.query.token;
    const decoded = jwt.verify(token,"top secret");
    let username = decoded.user.username;

    var meal = {
        calories:cal,
        proteins:prot,
        carbs:carbs,
        fats:fat,
        date:date,
        mealId:id,
        amount:amount,
        name:name
    }
    
    //extract consumption array from the User
    let consumption;
    await User.findOne({username:username},function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            consumption = foundUser.consumption;
        }
    });

    //edit consumption array with new meals object (delete old and add new)
    if(id){
        let mealIndex = consumption.findIndex(function(item){
            return item.mealId==id;
        });
        consumption.splice(mealIndex,1,meal);
    }else{
        console.log("");
    }

    //adding user data to consumption array
    User.updateOne({username:username},{consumption:consumption},function(err){
        if(err){
            console.log(err);
            res.status(409).send("something went wrong");
        }else{
            res.status(200).send("Meal has been updated");
        }
    });



});

//delete consumption history data--
App.post("/historyDelete", async function(req,res){

    let id = req.body.mealId;

    const token = req.query.token;
    const decoded = jwt.verify(token,"top secret");
    let username = decoded.user.username;
    
    //extract consumption array from the User
    let consumption;
    await User.findOne({username:username},function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            consumption = foundUser.consumption;
        }
    });

    //edit consumption array with new meals object (delete old and add new)
    if(id!=undefined){
        let mealIndex = consumption.findIndex(function(item){
            return item.mealId==id;
        });
        consumption.splice(mealIndex,1);
    }else{
        console.log("the meal does not exist");
    }


    //adding user data to consumption array
    User.updateOne({username:username},{consumption:consumption},function(err){
        if(err){
            console.log(err);
            res.status(409).send("something went wrong");
        }else{
            res.status(200).send("done");
        }
    });
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
                console.log("Error happened here " + err);
            }else{
                console.log(foodItem.name +  " added successfully");
            }
        });
    });
    res.send("Items added to the database");
});

//-Service route - add several restaurants provided in RestData array
App.post("/addRestaurants", function(req,res){
    RestData.map(item=>{
        var restName = item.name;
        var restLogo = item.logoUrl;
            
        const restaurant = new Restaurant ({
            name: restName,
            logoUrl: restLogo
        })

        restaurant.save(function(err){
            if(err){
                console.log("Error happened here " + err);
            }else{
                console.log(restaurant.name +  " added successfully");
            }
        });
    });
    res.send("Restaurants added to the database");
});


//Serve static assets if in production
if(process.env.NODE_ENV==="production"){
    App.use(Express.static("umev2.0/build"))
    App.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,"umev2.0","build","index.html"))
    });
}

const port = process.env.PORT || 8000;
App.listen(port, () => {
    console.log(`Server started on port ${port}`);
});