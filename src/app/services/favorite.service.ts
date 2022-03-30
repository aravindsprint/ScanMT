import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

const STORAGE_KEY = "favoriteStocks";

@Injectable()
export class FavoriteService {
  constructor(public storage: Storage) {}



  stockIdWarehouse;
  stockIdBatchNo;
  favstocks = [];
  result:any = [];
  fStock = [];
  favStock1;
  resultoffavstocks;
  favstocksLength;

  isFavorite(stockId) {
    console.log("stockId", stockId);
    return this.getAllFavoriteStocks().then((result) => {
      this.result = result;
      console.log("result", this.result);
      return this.result && this.result.indexOf(stockId) !== -1;
    });
  }



  favoriteStock(stockId) {
    console.log(" inside favoriteStock stockId", stockId);
    stockId.isfavorites = true;
    stockId.name = "";
    stockId.owner = "";
    stockId.creation = "";
    stockId.modified = "";
    stockId.modified_by = "";
    stockId.parent = "";
    stockId.parentfield = "items";
    stockId.parenttype = "Stock Entry";
    stockId.docstatus = 1;
    stockId.item_name = "";
    stockId.is_finished_item = 0;
    stockId.is_scrap_item = 0;
    stockId.is_process_loss = 0;
    stockId.description = "";
    stockId.hsn_code = stockId.gst_hsn_code;
    stockId.commercial_name = "";
    stockId.color = "";
    stockId.width = "";
    stockId.item_group = "";
    stockId.gross_weight_in_kg = 0;
    stockId.transfer_qty = 0;
    stockId.retain_sample = 0;
    stockId.uom = stockId.stock_uom;
    stockId.conversion_factor = 1;
    stockId.sample_quantity = 0;
    stockId.basic_rate = 0;
    stockId.additional_cost = 0;
    stockId.valuation_rate = 0;
    stockId.allow_zero_valuation_rate = 0;
    stockId.set_basic_rate_manually = 0;
    stockId.basic_amount = 0;
    stockId.amount = 0;
    stockId.blocked_qty = 0;
    stockId.income_account = "";
    stockId.expense_account = "";
    stockId.cost_center = "";
    stockId.actual_qty = 0;
    stockId.transferred_qty = 0;
    stockId.allow_alternative_item = 0;
    stockId.doctype = "Stock Entry Detail"


    //console.log("stockId.change_batch_status",stockId.change_batch_status);
    //console.log("stockId.transfer_qty",stockId.transfer_qty);

    //return new Promise(function (resolve) {
    return this.getAllFavoriteStock().then((result) => {
      if (result) {
        this.result = result;
        this.result.push(stockId);
        console.log("result", this.result);
        var finalfavStock = this.storage.get(STORAGE_KEY);
        console.log("finalfavStock", finalfavStock);
        return this.storage.set(STORAGE_KEY, this.result);
      } else {
        var finalfavStock = this.storage.get(STORAGE_KEY);
        console.log("finalfavStock", finalfavStock);
        return this.storage.set(STORAGE_KEY, [stockId]);
      }
    });

    //})
  }

  unfavoriteStock(stockId) {
    stockId.isfavorites = false;
    console.log(" inside unfavoriteStock stockId", stockId);
    return this.getAllFavoriteStock().then((result) => {
      if (result) {
        console.log("unfav result",result);
        this.result = result;
        var index = this.result.indexOf(stockId);
        this.result.splice(index, 1);
        var finalfavStock = this.storage.get(STORAGE_KEY);
        console.log("finalunfavStock", finalfavStock);
        return this.storage.set(STORAGE_KEY, this.result);
      }
    });
  }

  getAllFavoriteStocks() {
  //return new Promise( (resolve, reject) => {
    var favStock = this.storage.get(STORAGE_KEY);
    console.log("favStock", favStock);
    this.resultoffavstocks = favStock;
    this.favstocksLength = this.resultoffavstocks.length;
    console.log("favstocksLength", this.favstocksLength);
    //if(this.favstocksLength === undefined){
       //console.log("undefined", this.favstocksLength);
       //reject(favStock);
       //return this.storage.get(STORAGE_KEY);
    //}else{
       //console.log("not undefined", this.favstocksLength);
       //resolve(favStock);
       return this.storage.get(STORAGE_KEY);
    //}    
    
    //});
  }

  getAllFavoriteStock() {
   return new Promise( (resolve) => {
    var favStock = this.storage.get(STORAGE_KEY);
    console.log("favStock", favStock);
    resolve(favStock);
    
    //return this.storage.get(STORAGE_KEY);
    });
   
  }



  removeAllFavoriteStocks() {
    return this.getAllFavoriteStock().then((result) => {
      if (result) {
        console.log("unfav result",result);
        this.result = result;
        this.result.splice(0, this.result.length);
        var finalfavStock = this.storage.get(STORAGE_KEY);
        console.log("finalunfavStock", finalfavStock);
        return this.storage.set(STORAGE_KEY, this.result);
      }
    });
  }
}
