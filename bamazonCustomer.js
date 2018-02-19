const inquirer = require('inquirer');
const mysql = require('mysql');

var bamazonConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dave",
    password: "dbpass",
    database: "bamazon"
});

inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Welcome to bAmazon! What is your name?'

}).then(answers => {
    console.log(`Welcome ${answers.name}!`);
    console.log(`---------------------------------`);
    getAll();
});

function connectToBamazon() {
    bamazonConnection.connect(function (error) {
        if (error) {
            console.error(error);
        }

    });
}

function disconnectFromBamazon() {
    bamazonConnection.end(function (error) {
        if (error) {
            console.log(error);
        }
        console.log(`query made and connection ended successfully`)
    });
}
function getAll() {
    connectToBamazon();
    bamazonConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        console.log(`Here are our items in stock!`);
        for (var i = 0; i < response.length; i++) {
            var productName = response[i].product_name;
            console.log(`Item ID: ${response[i].item_id}\n\nProduct Name: ${response[i].product_name}\nPrice: ${response[i].price}\n`);
            console.log('-----------------------------')
        }
    })
    askForProductID();
};
function askForProductID() {
    inquirer.prompt({
        type: 'list',
        name: 'productid',
        message: 'What is the Item ID of the product you wish to purchase?',
        choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    }).then(answers => {
        switch (answers.productid) {
            case '1':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '2':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '3':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '4':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '5':
                var productID = answers.productid;
                askQuantity();
                break;
            case '6':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '7':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '8':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '9':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            case '10':
                var productID = answers.productid;
                askQuantity(productID);
                break;
            default:
                console.log('something went wrong.')
        }
    })
}
function askQuantity(productID) {
    inquirer.prompt({
        type: 'input',
        name: 'quantity',
        message: 'How many of this item would you like to order?'
    }).then(answers => {
        if (isNaN(answers.quantity)) {
            console.log('That isnt a number.')
            askQuantity(productID);
        }
        if (Number(answers.quantity)) {
            var userQuantity = answers.quantity;
            checkDatabase(productID, userQuantity);
        }
        if (answers.quantity === '') {
            console.log('Please input an integer and try again.');
            askQuantity(productID);
        }
    });
}
function checkDatabase(productID, userQuantity) {
    bamazonConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        for (var i = 0; i < response.length; i++) {
            var item = response[i].item_id;
            var productForSummary = response[i].product_name;
            var productPrice = response[i].price;
            var currentStock = response[i].stock_quantity;
            if (item.toString() === productID.toString()) {
                if (Number(response[i].stock_quantity) < Number(userQuantity)) {

                    console.log(
                        `-----------------\n\n
Insufficient stock for your order for ${response[i].product_name}! 
We currently have ${response[i].stock_quantity} in stock.\n\n
Let me restock for you. 
Please Try again!\n\n
-------------------`
                    )
                    reStockStore();
                    askQuantity(productID);

                }
                if (Number(response[i].stock_quantity) >= Number(userQuantity)) {
                    orderSummary(productPrice, productForSummary, productID, userQuantity, currentStock);
                    // bamazonCheckout();
                }

            }
        }
    });
}

function orderSummary(productPrice, productForSummary, productID, userQuantity, currentStock) {
    // userQuantity = Number(userQuantity);
    var totalPrice = productPrice * userQuantity;
    console.log(
        `------------------\n    
Here is your Order Summary! Is this correct?\n
------------------\n\n
    
Product Name: ${productForSummary}\n\n
    
Quantity ordered: ${userQuantity}\n\n
    
Total: $${totalPrice.toFixed(2)}\n\n`
    )
    inquirer.prompt({
        type: 'list',
        name: 'confirmcheckout',
        message: 'Would you like to confirm your order?',
        choices: ['Yes', 'No']
    }).then(answers => {
        var answer = answers.confirmcheckout;
        console.log(answer)
        if (answer === 'Yes') {
            var newStock = currentStock - userQuantity;
            bamazonCheckout(newStock, productID);
        }
        if (answer === `No`) {
            console.log(`its no`)
            getAll();
        }
    });
}

function bamazonCheckout(newStock, productID) {
    bamazonConnection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            },
            {
                item_id: productID
            }
        ],
        function (error, response) {
            if (error) {
                console.error(error);
            }
            else {
                console.log(`Congratulations! Your order is on the way. Now leaving store.`)
                console.log(`Remaining stock for Item ID ${productID}: ${newStock}`)
                disconnectFromBamazon();
            }
        });
};

function reStockStore() {
    bamazonConnection.query("UPDATE products SET ?", [
        {
            stock_quantity: 100
        }
    ], function (error, response) {
        if (error) {
            console.log(error);
        }
    });
    console.log(`STORE HAS BEEN RESTOCKED! to 100 for each available item! :)`)
};
