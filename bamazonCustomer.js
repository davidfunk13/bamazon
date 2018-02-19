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
        console.log('connected');
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
            console.log(`Item ID: ${response[i].item_id}\n\nProduct Name: ${response[i].product_name}\nPrice: ${response[i].price}\n`);
            console.log('-----------------------------')
        }
    });
    // disconnectFromBamazon()
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
                console.log('case 1')
                askQuantity(productID);
                break;
            case '2':
                var productID = answers.productid;
                console.log('case 2')
                askQuantity(productID);
                break;
            case '3':
                var productID = answers.productid;
                console.log('case 3');
                askQuantity(productID);
                break;
            case '4':
                var productID = answers.productid;
                console.log('case 4');
                askQuantity(productID);
                break;
            case '5':
                var productID = answers.productid;
                console.log('case 5');
                askQuantity();
                break;
            case '6':
                var productID = answers.productid;
                console.log('case 6');
                askQuantity(productID);
                break;
            case '7':
                var productID = answers.productid;
                console.log('case 7');
                askQuantity(productID);
                break;
            case '8':
                var productID = answers.productid;
                console.log('case 8');
                askQuantity(productID);
                break;
            case '9':
                var productID = answers.productid;
                console.log('case 9');
                askQuantity(productID);
                break;
            case '10':
                var productID = answers.productid;
                console.log('case 10');
                askQuantity(productID);
                break;
            default:
                console.log('asdasda')
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
    console.log(`checkdatabase function: Product ID: ${productID} userQuantity: ${userQuantity}`)
    bamazonConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        console.log(`Product ID: ${productID}`)
        for (var i = 0; i < response.length; i++) {
            var item = response[i].item_id;
            var productForSummary = response[i].product_name;
            var productPrice = response[i].price;
            if (item.toString() === productID.toString()) {
                console.log(productForSummary)
                if (Number(response[i].stock_quantity) < Number(userQuantity)) {
                    console.log(`Insufficient stock for your order for ${response[i].product_name}! We currently have ${response[i].stock_quantity} in stock. Please Try again!`)
                    askQuantity(productID);
                }
                if (Number(response[i].stock_quantity) > Number(userQuantity)) {
                    orderSummary(productPrice, productForSummary, productID, userQuantity);
                    // bamazonCheckout();
                }
            }
        }
    });
}

function orderSummary(productPrice, productForSummary, productID, userQuantity) {
    // userQuantity = Number(userQuantity);
    var totalPrice = productPrice * userQuantity;
    console.log(
        `------------------\n    
Here is your Order Summary! Is this correct?\n
------------------\n\n
    
Product Name: ${productForSummary}\n\n
    
Quantity ordered: ${userQuantity}\n\n
    
Total: ${totalPrice}\n\n
    
If yes, you will be taken to a confirm order page with a total!`
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
            console.log(`its yes`);
        }
        if (answer === `No`) {
            console.log(`its no`)
            getAll();
        }
    });
}

function bamazonCheckout() {
    bamazonConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        console.log('checkout')
    });
};
