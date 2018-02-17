DROP database if exists bamazon;

create database bamazon;

use bamazon;

CREATE TABLE products (
	item_id int primary key not null auto_increment,
    product_name varchar(200) null,
    department_name varchar(200) null,
    price decimal(12,2),
    stock_quantity int null
);

INSERT INTO products VALUES (1,"Overwatch Digital Download", "Video Games", 59.99, 9999);

INSERT INTO products Values (2,"PUBG Digital Download", "Video Games", 34.99, 9999);

INSERT INTO products Values (3,"The Men Who Stare at Goats", "Movies", 19.99, 30);

INSERT INTO products Values (4,"Pulp Fiction", "Movies", 19.99, 22);

INSERT INTO products Values (5,"Bedside Table", "Furniture", 150.99, 10);

INSERT INTO products Values (6,"Desk", "Furniture", 300.99, 5);

INSERT INTO products Values (7, "Shirt", "Clothing", 34.99, 15);

INSERT INTO products Values (8,"Shoes", "Clothing", 56.99, 10);

INSERT INTO products Values (9,"Pants", "Clothing", 50.99, 8);

INSERT INTO products Values (10,"Fridge", "Appliances", 999.99, 3);


select * from products










