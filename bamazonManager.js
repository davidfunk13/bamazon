//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');

// Table constructor
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
            return;
        }
        if (answers.mainmenu === 'View Low Inventory') {
            viewLow()
        }
        if (answers.mainmenu === 'Add to Inventory') {
            addToInventory();
        }
        if (answers.mainmenu === 'Add New Product') {
            insertToDatabase();
        }
    });
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
        }
        console.log(table.toString());
    })
};

//pushes databse values to respective table columns when function show all is called.
function pushToTable(itemID, productName, itemPrice, departmentName, currentStock) {
    table.push(
        [itemID, productName, itemPrice, departmentName, currentStock]
    );
}

//function to view low inventory
function viewLow() {
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
            if (currentStock <= 5) {
                pushToTable(itemID, productName, itemPrice, departmentName, currentStock);
            }

        }
        console.log(table.toString());
    })
};

function insertToDatabase() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newproduct',
            message: 'What is the name of the product you wish to add to the database?',
        },
        {
            type: 'input',
            name: 'department',
            message: 'What is the department the product should be placed in?',
        },
        {
            type: 'input',
            name: 'price',
            message: 'How much does this product cost?',
        },
        {
            type: 'input',
            name: 'stock',
            message: 'How many of this item do we have?'
        }
    ]).then(answers => {
        var newProduct = answers.newproduct;
        var newItemdepartment = answers.department;
        var newItemPrice = answers.price;
        var newItemStock = answers.stock
        console.log(newProduct, newItemdepartment, newItemPrice, newItemStock);
        var sql = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${newProduct}", "${newItemdepartment}", ${newItemPrice}, ${newItemStock})`;
        bamazonManagerConnection.query(sql, function (error, response) {
            if (error) {
                console.log(error);
            }
            console.log(response);
        });
    })
};

// add to inventory function
function addToInventory() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'productid',
            message: 'What is the Item ID of the product you wish to update in the database?',
        },
        {
            type: 'input',
            name: 'howmany',
            message: 'How many more of this item do we have?',
        },
    ]).then(answers => {
        var idToUpdate = answers.productid;
        var howManyMore = answers.howmany;
        var sql = `UPDATE products SET stock_quantity = stock_quantity + ${howManyMore} WHERE item_id = ${idToUpdate}`;
        bamazonManagerConnection.query(sql, function (error, response) {
            if (error) {
                console.log(error);
            }
        });
    });
}
connectToBamazon();
mainMenu()