import{APIGatewayEvent,Callback,Context,Handler} from 'aws-Lambda';
import {tableDAO} from "./tableDAO";

export async function tableService(rowData:any,header:any,tableName:any,context: Context, callback: Callback) {

  var tab =tableName.toString().split(".");
  const table=tab[0];

  //cal DAO for saving in DB
  tableDAO(rowData,header,table,context,callback);
}