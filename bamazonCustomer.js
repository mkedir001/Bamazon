var inquirer = require('inquirer');
var mysql = require('mysql');



var thisID = "";
var thisUnit = "";


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: '',
  database: 'bamazonDB'
});



connection.connect(function(err){
  if(err) throw err;
  console.log("connected as id " + connection.threadId);
  
});

function Start() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.log("These are the items available for sale: ");
        console.log("             ");
        for (i = 0; i < response.length; i++) {
          
            
            console.log("             ");
            console.log("Item: " + response[i].product_name);
            console.log("Product ID: " + response[i].id);
            console.log("Price: $" + response[i].price);
            console.log("________________________")


        }

       
    });
    inquirer.prompt([
        {
            name: "ID",
            type: "list",
            message: "what is the ID of the product you would like to buy",
            choices: ["1", "2", "3","4","5","6","7","8","9","10"]
        },
        {
            name: "unit",
            type: "input",
            message: "How many units would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    
    ]).then(function (answer) {
        thisID = parseInt(answer.ID)
        thisUnit = parseInt(answer.unit)

        // console.log("you have seleceted: " + thisID);
        // console.log("you have selected " + purchaseUnit + " units")
        connection.query("SELECT * FROM products",
        {id: parseInt(answer.ID)},
         function (err, response) {
            if (err) throw err;
            for (i = 0; i < response.length; i++) {
                if (response[i].id === parseInt(answer.ID)) {
                    // console.log("working here as well " + answer.ID);
                };  
            }
 checkStock();
 
            // connection.end();
        });
        });
        // itemsbyID(thisID);
            // connection.end();
}

function checkStock() {

    connection.query("SELECT * FROM products WHERE ?",{id: parseInt(thisID)}, function (err, response) {
        if (err) throw err;
        for (i = 0; i < response.length; i++) {
            if(response[i].id === parseInt(thisID)){
                thisItem = response[i]
                
                if(thisItem.stock_quantity<parseInt(thisUnit)){
                     console.log("Sorry, your order currently exceeds our inventory stock");
                connection.end();
                }
           else{
    newQuantity = thisItem.stock_quantity - parseInt(thisUnit)
    // console.log(newQuantity);
    console.log("placing order now");
    connection.query
placeOrder();    


};

                
            }
            
        }

        // connection.end();
    });
}


function placeOrder() {
    // console.log("Updating Product.....\n");
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: parseInt(newQuantity)
        },
        {
            id: parseInt(thisID)
        }],
        function (err, response) {
            console.log("order placed");
            connection.end();
        }
    )
}


Start();
