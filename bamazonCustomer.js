const inquirer = require('inquirer');
const mysql = require('mysql');

var connectedToBamazon = false;

var bamazonConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dave",
    password: "dbpass",
    database: "bamazon"
});

function askName() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Welcome to bAmazon! What is your name?'

    }).then(answers => {
        console.log(`Welcome ${answers.name}!`);
        console.log(`---------------------------------`);
        getAll();
    });
};

function connectToBamazon() {
    if (connectedToBamazon = false) {
        bamazonConnection.connect(function (error) {
            if (error) {
                console.error(error);
            }
            connectedToBamazon = true;
        });
    }
};

function disconnectFromBamazon() {
    bamazonConnection.end(function (error) {
        if (error) {
            console.log(error);
        }
        console.log(`Connection ended successfully`)
        connectedToBamazon = false;
    });
};
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
    placeOrder();
};

function placeOrder() {
    inquirer.prompt([{
        type: 'input',
        name: 'askforid',
        message: 'What is the ID number of the product that you would like to order?',
    }, {
        type: 'input',
        name: 'quantity',
        message: 'How many of this item would you like to order?',
    }]).then(answers => {
        var orderedItemID = Number(answers.askforid);
        var orderQuantity = Number(answers.quantity);
        inventoryCheck(orderedItemID, orderQuantity);
    });
};

function inventoryCheck(orderedItemID, orderQuantity) {
    bamazonConnection.query("SELECT * from products WHERE ?", {
        item_id: orderedItemID,
    }, function (error, response) {
        if (error) {
            console.error(error);
        }
        ///ask why i cant response.stock_quantity without loop?
        for (var i = 0; i < response.length; i++) {
            var currentStock = response[i].stock_quantity;
            var productName = response[i].product_name;
            var productPrice = response[i].price;
            var itemID = response[i].item_id;
            console.log(`Product Name: ${productName}, Product Price: ${productPrice}, Item ID: ${itemID}, Current Stock: ${currentStock}`);
            if (currentStock < orderQuantity) {
                console.log(`Insufficient quantity of ${productName} in stock to fulfill this order. We currently have ${currentStock} units in stock. Please try again. `);
                getAll();
            }
            if (currentStock >= orderQuantity) {
                orderSummary(productName, productPrice, orderQuantity, itemID, currentStock);
            }
        }


        console.log(`Ordered Item ID: ${orderedItemID}, Order Quantity: ${orderQuantity}`);

    });
}
function orderSummary(productName, productPrice, orderQuantity, itemID, currentStock) {
    console.log(`Here is a summary of your order!\n\n Product: ${productName}\n Product Price: ${productPrice}\n Order Quantity: ${orderQuantity}`)
    inquirer.prompt({
        type: 'list',
        name: 'continueorder',
        message: 'Do you wish to continue with your order?',
        choices: ['Yes', 'No'],
    }).then(answers => {
        console.log(answers.continueorder);
        if (answers.continueorder === 'Yes') {
            checkout(productName, productPrice, orderQuantity, itemID, currentStock);
        }
        if (answers.continueorder === 'No') {
            getAll();
        }
    })
};

function checkout(productName, productPrice, orderQuantity, itemID, currentStock) {
    var orderTotal = productPrice * orderQuantity;
    var newStock = currentStock - orderQuantity;
    console.log(currentStock, newStock)
    bamazonConnection.query("UPDATE products SET ? WHERE ?", [
        {
            stock_quantity: newStock
        },
        {
            item_id: itemID
        }
    ], function (error, response) {
        if (error) {
            console.log(error);
        }
    });
    ///order recap
    console.log(`Congratulations and thank you for your order!\n\nYour total for this order comes to: $${orderTotal}\nWe now have ${newStock} of the item you ordered remaining until our next shipment.\n\nThank you for choosing bAmazon.`)
    disconnectFromBamazon();
}
askName();