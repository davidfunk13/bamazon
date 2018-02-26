//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');

var table = new Table({
    head: ['Item ID', 'Product Name', ' Price', 'Department Name', 'Our Current Stock'],
    colWidths: [20, 20, 20, 20, 20]
});

//database connection check
var connectedToBamazon = false;

//Database connection
var bamazonManagerConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "dave",
    password: "dbpass",
    database: "bamazon"
});

//Manager menu inquirer function
function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'mainmenu',
        message: ' Hello and Welcome to bAmazon Manager Portal. What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
    }).then(answers => {
        if (answers.mainmenu === 'View Products for Sale') {
            showAll();
        }
        // if (answers.mainmenu === 'View Low Inventory') {

        // }
        // if (answers.mainmenu === 'Add to Inventory') {

        // }
        // if (answers.mainmenu === 'Add new Product') {

        // }
    })
};

//Connect to database function
function connectToBamazon() {
    if (connectedToBamazon = false) {
        bamazonManagerConnection.connect(function (error) {
            if (error) {
                console.error(error);
            }
            connectedToBamazon = true;
        });
    }
};

//Database disconnect function
function disconnectFromBamazon() {
    bamazonManagerConnection.end(function (error) {
        if (error) {
            console.log(error);
        }
        console.log(`Connection ended successfully`)
        connectedToBamazon = false;
    });
};

//Show all function
function showAll() {
    bamazonManagerConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        for (var i = 0; i < response.length; i++) {
            var itemID = response[i].item_id;
            var productName = response[i].product_name;
            var departmentName = response[i].department_name;
            var itemPrice = response[i].price;
            var currentStock = response[i].stock_quantity;
            pushToTable(itemID, productName, itemPrice, departmentName, currentStock);
            // console.log(`Item: ${itemID} | Product Name: ${productName} | Department: ${departmentName} Price: ${itemPrice} Stock Quantity: ${currentStock}`);
        }
        console.log(table.toString());
        // function tableMaker('values')
    })
};
function pushToTable(itemID, productName, itemPrice, departmentName, currentStock) {
// console.log(`Item: ${itemID} | Product Name: ${productName} | Department: ${departmentName} Price: ${itemPrice} Stock Quantity: ${currentStock}`);
    table.push(
        [itemID, productName, itemPrice, departmentName, currentStock]
    );
}
connectToBamazon();
mainMenu();