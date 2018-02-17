    const inquirer = require('inquirer');   
    const mysql = require('mysql');

    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Welcome to bAmazon! What is your name?'

    }).then(answers => {
        console.log(`Welcome ${answers.name}!`);
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

    var applicationStart = function() {
        inquirer.prompt()
    }

function getAll() {
      bamazonConnection.query("SELECT * from products", function (error, response) {
        if (error) {
            console.error(error);
        }
        console.log(response);
    })
}
  