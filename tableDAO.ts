import { Callback, Context, Handler } from 'aws-lambda';
const mysql = require('mysql');
//connection config
const config = {
    user: "monroneylabeldev",
    database: "tmp",
    password: "monroneylabeldev",
    port: 3306,
    host: "monroneylabeldev.ciyuxl7dwssy.us-east-1.rds.amazonaws.com"
}
export async function tableDAO(data:any,header:any,table:any,context: Context, callback: Callback) {
    const connection = mysql.createConnection(config);

    console.log('connecting...');
    await new Promise((resolve, reject) => {
        connection.connect((err: any) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("successfully connected")
                resolve();
            }
        })
    })
    // var isTablePresent;
    // await new Promise ((resolve,reject)=>{
    // connection.query("select 1 from information_schema.tables where table_name=" + tableCheck, function (err: any, results: any, fields: any) {
    //     console.log(results);
    //     if (err) {
    //         console.log(err)
    //         isTablePresent = 0;
    //         console.log("inside err block")
    //         reject();
    //     }
    //     else {
    //         if (results == undefined || results==[] || results.length==0) {
    //             isTablePresent = 0;
    //             console.log("inside undefined block")
    //             resolve();
    //         }
    //         else {
    //             isTablePresent = 1;
    //             console.log("inside created block")
    //             resolve();
    //         }
    //     }
    // })
    
    // })
    // if (isTablePresent == 0) {
    //     var header = data.shift();
    //     var headerStr="";
    //     header.forEach((ele:any)=>{
    //         headerStr += getColumnDefsn(ele);
    //     });
    //     headerStr = headerStr.slice(0,-1);
    //     console.log("header string"+headerStr);
    //     console.log("header",header);

    //     await new Promise ((resolve,reject)=>{
    //     connection.query(`create table ${table} (${headerStr})` , function (err: any, results: any, fields: any) {
    //         if (err) {
    //             console.log(err);
    //             reject()
    //         }
    //         else {
    //             console.log("table created successfully");
    //             resolve()
    //         }
    //     })
    // });

    // }
    // else{
    //     console.log("table already exists");
    // }

    // data.pop();
    console.log(data);
   
        await new Promise ((resolve,reject)=>{
        
            connection.query(`insert into ${table}(${header.join()}) values ?`,
            [data], function (error: any, result: any, field: any) {
                if (error) {
                    console.log("error in insertion");
                    reject();
                }
                else {
                    console.log("data inserted successfully");
                    resolve();
                }
            });
        });
    

    await new Promise((resolve, reject) => {
        connection.end((err: any) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("connection terminated")
                resolve();
            }
        })
    })

}
// function getColumnDefsn(column: any) {
//     return `${column} ${getType(column)}`;

// };
// function getType(col: any) {
//     switch (typeof col) {
//         case "string":
//             return "VARCHAR (255)";
//         case "number":
//             return "INT";
//         case "boolean":
//             return "bool";
//         default:
//             return console.log("no type");
           

//     }
// }
