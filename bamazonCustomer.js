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
        bamazonConnection.end(function (error) {
            if (error) {
                console.log(error);
            }
            console.log(`query made and connection ended successfully`)
            askForProductID();
        });
    });
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
                console.log('case 1')
                break;
            case '2':
                console.log('case 2')
                break;
            case '3':
                console.log('case 3');
                break;
            case '4':
                console.log('case 4');
                break;
            case '5':
                console.log('case 5');
                break;
            case '6':
                console.log('case 6');
                break;
            case '7':
                console.log('case 7');
                break;
            case '8':
                console.log('case 8');
                break;
            case '9':
                console.log('case 9');
                break;
                case '10':
                console.log('case 10');
                break;
            default:
                console.log('asdasda')
        }
    })
}
