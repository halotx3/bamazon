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
    intialShow();
    console.log('');
  });

let intialShow = function(){
    connection.query(`SELECT * FROM products`, function(err, res){
    if (err) throw err;
    console.log('');
    console.log('Products');
    console.log('________________________________________');
    for (let i=0; i < res.length; i++){
        console.log(`${res[i].item_id} |  ${res[i].product_name} |  $${res[i].price} | ${res[i].stock_quantity}`)
        idA.push([res[i].item_id]);
    }
    console.log('');
    console.log('');

    // console.log(res)
    inquirer.prompt([
        {
            type: 'input',
            name: 'chosenID',
            message: 'ENTER THE ID OF THE PRODUCT YOU WOULD LIKE TO BUY.....'
        },
    ]).then(function(idRes){
        let choID = parseInt(idRes.chosenID);
        
        inquirer.prompt([
            {
                type: 'input',
                name: 'orderNum',
                message: 'HOW MUCH WOULD YOU LIKE TO BUY?'
            }
        ]).then(function(qtyRes){
            let qAm = parseInt(qtyRes.orderNum);

            console.log(qAm);
            chckInven(qAm,choID);
        })
        // connection.query(`SELECT * FROM products`, function(err,res){
        //     if (err) throw err;
        //     for(i = 0; i < res[i]; i++){
        //         if (inquirerResponse.chosenID == res[i].item_id && parseInt(inquirerResponse.orderNum) < res[i].stock_quantity){
        //             connection.query(`UPDATE products SET stock_quantity = ${res[i].stock_quantity - parseInt(inquirerResponse.orderNum)} WHERE item_id = ${parseInt(chosenID)}`,
        //             function(err, res){
        //                 if (err) throw err;
        //                 let num = parseInt(inquirerResponse.orderNum) * res[i].stock_quantity;
        //                 console.log(`Your total price is ${parseFloat(num.toFixed(2))}`);
        //             });
        //         }
        //     };
        // })
    })
    
  });
}

// let inquire = function(){
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'chosenID',
//             message: 'ENTER THE ID OF THE PRODUCT YOU WOULD LIKE TO BUY.....'
//         },
//     ]).then(function(idRes){
//         let choID = parseInt(idRes.chosenID);
        
//         inquirer.prompt([
//             {
//                 type: 'input',
//                 name: 'orderNum',
//                 message: 'HOW MUCH WOULD YOU LIKE TO BUY?'
//             }
//         ]).then(function(qtyRes){
//             let qAm = parseInt(qtyRes.orderNum);

//             console.log(qAm);
//             chckInven(qAm);
//         })
//         // connection.query(`SELECT * FROM products`, function(err,res){
//         //     if (err) throw err;
//         //     for(i = 0; i < res[i]; i++){
//         //         if (inquirerResponse.chosenID == res[i].item_id && parseInt(inquirerResponse.orderNum) < res[i].stock_quantity){
//         //             connection.query(`UPDATE products SET stock_quantity = ${res[i].stock_quantity - parseInt(inquirerResponse.orderNum)} WHERE item_id = ${parseInt(chosenID)}`,
//         //             function(err, res){
//         //                 if (err) throw err;
//         //                 let num = parseInt(inquirerResponse.orderNum) * res[i].stock_quantity;
//         //                 console.log(`Your total price is ${parseFloat(num.toFixed(2))}`);
//         //             });
//         //         }
//         //     };
//         // })
//     })
// };

let chckInven = function(qty,id){
    connection.query(`SELECT stock_quantity, price FROM products WHERE item_id = ${id}`, function(err, res){
        console.log(res)
        if(res[0].stock_quantity >= qty){
            //Update the DB
            console.log(`YOUR TOTAL IS $${qty * res[0].price}`);
            connection.query(`UPDATE products SET stock_quantity = ${res[0].stock_quantity - qty} WHERE item_id = ${id}`);
        }else{
            console.log ('Sorry we do not have enough stock of that product')
        }

        connection.end();
    })
}