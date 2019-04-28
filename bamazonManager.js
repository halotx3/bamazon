let mysql = require("mysql");
let inquirer = require("inquirer");

let idA = [];

let connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log('');
    maner();
  });

  let maner = function (){
      inquirer.prompt([
          {
              type: 'list',
              name: 'operation',
              message: 'What operation would you like to perform today?',
              choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product','End']
          }
      ]).then(function(opInquire){
        switch (opInquire.operation){
            case 'View Products for Sale':
                viewProd();
                break;
            case 'View Low Inventory':
                viewLow();
                break;
            case 'Add to Inventory':
                addInv();
                break;
            case 'Add New Product':
                newProd();
                break;
            case 'End':
                process.exit(0);
                break;
        }
      });

      let viewProd = function(){
          connection.query('SELECT item_id, product_name, price, stock_quantity FROM bamazonDB.products;',function(err,res){
              if (err) throw err;
              console.log('================================================');
              console.table(res);
              console.log('================================================');
              setTimeout(maner,700)
          })
      }

      let viewLow = function(){
        connection.query('SELECT * FROM bamazonDB.products where stock_quantity < 5;', function(err,res){
            if (err) throw err;
            console.log('==================================================');
            console.table(res);
            console.log('==================================================');
            setTimeout(maner, 700)
        })
    }
    let addInv = function(){
        inquirer.prompt([
            {
                type: 'number',
                name: 'updateID',
                message: 'Which Product would you like to update?  Please Enter the Item ID....',
            },
            {
                type: 'number',
                name: 'updateNum',
                message: 'How much stock would you like to add?'
            }
        ]).then(function(invRes){
            connection.query(`UPDATE products SET stock_quantity = ${invRes.updateNum} + stock_quantity WHERE item_id = ${invRes.updateID}`, function(err,res){
                if (err) throw err
                console.log('The product has been updated');
                console.log('================================================');
                setTimeout(maner, 700);
        });
        })
    }

    let newProd = function(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'prodName',
                message: 'Enter Product Name.....'
            },
            {
                type: 'input',
                name: 'deptName',
                message: 'Enter Department Name.....'
            },
            {
                type: 'number',
                name: 'prdPrice',
                message: 'Enter Product Price.....'
            },
            {
                type: 'input',
                name: 'prdStock',
                message: 'Enter Starting Product Stock Count.....'
            }
        ]).then(function(newRes){
            connection.query(`
            INSERT INTO products(product_name, department_name, price, stock_quantity)
            VALUE ('${newRes.prodName}', '${newRes.deptName}', ${newRes.prdPrice}, ${newRes.prdStock})
            `,function(err, res){
                if (err) throw err
                console.log('The product has been added.....');
                console.log('================================================');
                setTimeout(maner, 700);
            });
        })
    }

  }