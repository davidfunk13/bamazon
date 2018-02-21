const inquirer = require('inquirer');
const mysql = require('mysql');

function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'mainmenu',
        message: ' Hello and Welcome to bAmazon Manager Portal. What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory']
    })
}