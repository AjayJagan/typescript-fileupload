import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import {tableService} from './tableService';
import AWS from 'aws-sdk';
const {xlsx} =require('xlsx');
//const { csvToJson } = require('convert-csv-to-json');
var s3 = new AWS.S3();
export async function handler(event: any, context: Context, callback: Callback) {

    console.log('event Object', event);
    var src_bkt = event.Records[0].s3.bucket.name;
    var src_key = event.Records[0].s3.object.key;
    console.log('the bucket is', src_bkt);
    console.log('the src_key is', src_key);
    var fileBuffer: any;
    await new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: src_bkt,
            Key: src_key,
        }, (err: any, data: any) => {
            if (err) {
                console.log('err', err.stack);
                reject(err);
            }
            else {
                fileBuffer = new Buffer(data.Body);
                resolve(data.body);
            }
        })
    });
    
    const wb = await xlsx.read(fileBuffer, { type: "buffer" });
    const ws = wb.Sheets.Sheet1;
    const csv = xlsx.utils.sheet_to_json(ws);
    console.log(csv);

    var header = [];
    for (var k in csv[0]) {
        header.push(k)
    }
    console.log(header);

    var rowdata = [];
    for (var i = 0; i < csv.length; i++) {
        let dat :any = [];
        Object.keys(csv[i]).forEach((key) => {
            dat.push(csv[i][key]);
        })
        rowdata.push(dat);
    }
    console.log(rowdata);


    //console.log(fileBuffer.toString("utf8"));

    // var data = fileBuffer
    //     .toString("utf8")
    //     .split("\n")
    //     .map((e: any) => e.split(";").map((e: any) => e.trim()));
    // var lineArray: any[] = [];
    // data.forEach(function (infoArray: any, index: any) {
    //     var line = infoArray.join(",");
    //     lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    // });
    // var csvContent = lineArray.join("\n");
    //console.log(csvContent)

    // var data = fileBuffer
    //     .toString("utf8")
    //     .split("\n")
    //     .map((e:any) => e.replace(/['"]+/g, ""))
    //     .map((e:any) => e.split(";").map((e:any) => e.trim()));
    // console.log("tha data is", data)

    tableService(rowdata,header,src_key, context, callback);

}