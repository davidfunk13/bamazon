const inquirer = require('inquirer');
const mysql = require('mysql');

inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Welcome to bAmazon! What is your name?'

}).then(answers => {
    console.log(`Welcome ${answers.name}!`);
    console.log(`---------------------------------`);
    getAll();
    askForProductID();
});

var bamazonConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dave",
    password: "dbpass",
    database: "bamazon"
});

bamazonConnection.connect(function (error) {
    if (error) {
        console.error(error);
    }
});

function getAll() {
    bamazonConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        console.log(`Here are our items in stock!`);
        for (var i = 0; i < response.length; i++) {
            console.log(`Item ID: ${response[i].item_id}\n\nProduct Name: ${response[i].product_name}\nPrice: ${response[i].price}\n`);
            console.log('-----------------------------')
        }
        bamazonConnection.end(function(error) {
            if (error) {
                console.log(error);
            }
            console.log(`query made and connection ended successfully`)
        })
    })
}

function askForProductID() {
    inquirer.prompt({
        type: 'list',
        name: 'what_product',
        message: 'What is the ID of the product you would like to purchase?',
        choices: [1,2,3,4,5,6,7,8,9,10]
    }).then(answers => {
        console.log(answers);
    })
}
