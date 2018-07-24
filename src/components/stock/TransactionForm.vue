<template lang="html">
  <div class="transactionform">
    <div v-if="!long" class="row">
      <div class="form-group col-xs-3">

        <input class="form-control" v-model="tx.quantity" type="number">

      </div>
      <div class="form-group">
        <button  @click="performQuickTransaction('Add')" class="btn btn-primary">Add</button>
        <button @click="performQuickTransaction('Remove')" class="btn btn-danger">Remove</button>
      </div>
    </div>

    <div v-if="long" class="form-horizontal">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>

      <div class="form-group">
        <label class="col-sm-2 control-label ">
          Operation
        </label>


        <div class="col-sm-10">
          <select class="form-control" name="type" v-model="tx.operation">
                  <option value="Add">Add</option>
                  <option value="Remove">Remove</option>
          </select>
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Quantity
        </label>


        <div class="col-sm-10">
          <input name="quantity" class="form-control" type="number" v-model="tx.quantity" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Date
        </label>

        <div class="col-sm-10">
          <input name="date" class="form-control" type="date" v-model="tx.date" value="">
        </div>
      </div>

        <div class="form-actions">
          <button @click="saveClicked()"  class="btn btn-primary" title="Save details">Save</button>
        </div>


    </div>

  </div>

</template>

<script>
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'transactionform',
  props: {
    item: Object,
    long: Boolean,
    mode: String,
    transaction_id: Number
  },
  data() {
      return {
        tx:{
          quantity: 0,
          date: this.getDateToday(),
          operation: 'Add'
        },
        old_tx: {},
        alert:{
          message: '',
          type: '',
          raised: false
        },
      }
  },
  methods: {
    getDateToday(){
      var today = new Date();
      var month_num = today.getMonth() + 1;
      var mm = month_num < 10 ? '0' + month_num : ('' + month_num);
      var date = today.getFullYear()+'-'+mm+'-'+today.getDate();
      return date;
    },
    saveClicked(){
      // Add form check.
      if (this.mode == 'Add')
        this.performQuickTransaction(this.tx.operation,this.tx.date);
      else //Edit form
        this.editTransaction(this.old_tx,this.tx,this.item);
    },

    fetchTransaction(id){
      restAPI.get('transaction/'+id + '/')
      .then(response => {
        this.old_tx = Object.assign({},response.data);
        this.old_tx['quantity'] = response.data['tx_quantity'];
        this.tx.quantity = response.data['tx_quantity'];
        this.tx.operation = response.data['operation'];
        this.tx.date = response.data['date'];
      }).catch(e => {
        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
      })
    },
    performQuickTransaction(tx_op,date=null){
      if (this.tx.quantity == 0)
        return;
      if (this.editStockItem(tx_op,this.tx.quantity,this.item)) {
        if (date == null)
          date = this.getDateToday()
        this.addTransaction(tx_op,date);
      }
    },
    addTransaction(tx_op,date){

      var tx = {
        tx_quantity: parseInt(this.tx.quantity),
        operation: tx_op,
        date: date,
        item: this.item.id
      };
      // console.log(tx);
      restAPI.post('transaction/', tx)
          .then(response => {
            this.emitAlert('Item: ' + this.item.description + '  |  Quantity updated succesfully','success');
          }).catch(e => {
            console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
          })
    },
    editStockItem(tx_op,tx_quantity,item,mute_alerts=false){
      var result = true;
      tx_quantity = parseInt(tx_quantity);
      if (tx_op === 'Add') {
        if (item.reserve_quantity == item.reserve_quantity_max){
          item.quantity += tx_quantity;
        } else if (item.reserve_quantity < item.reserve_quantity_max){
          var diff = item.reserve_quantity_max - item.reserve_quantity;
          if (tx_quantity <= diff){
            item.reserve_quantity += tx_quantity;
          } else{
            item.reserve_quantity = item.reserve_quantity_max;
            item.quantity += (tx_quantity - diff)
          }
        }else {
          console.error("reserve quantity can't be more than max");
        }
      }else{ //Remove case
        if (item.quantity >= tx_quantity){
          item.quantity -= tx_quantity;
        }else {
          var diff = tx_quantity - item.quantity;
          if (diff > item.reserve_quantity){
            var itemsAvailable = (item.quantity + item.reserve_quantity);
            this.emitAlert("Items requested: " + tx_quantity +
            " | Items available: " + itemsAvailable,'danger');
            result=false;
          } else{
            item.quantity = 0;
            item.reserve_quantity -= diff;
          }
        }
      }
      if (result != false){
        restAPI.put('item/' + item.id + '/', item)
            .then(response => {
              this.emitAlert('Item: ' + item.description + '  |  Quantity edited','info');
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
            })

      };
      return result;
    },
    editTransaction(old_tx,tx,item){
      var quantity = 0;
      old_tx.quantity = parseInt(old_tx.quantity);
      tx.quantity = parseInt(tx.quantity);
      var edit_op = ''
      if (old_tx.operation == tx.operation){

        var diff_quantity = Math.abs(old_tx.quantity - tx.quantity);
        if (diff_quantity != 0){
          if (tx.operation == 'Add'){

            if (old_tx.quantity >= tx.quantity)
              edit_op = 'Remove';
            else
              edit_op = 'Add';


          } else {
            if (old_tx.quantity >= tx.quantity)
              edit_op = 'Add';
            else
              edit_op = 'Remove';
          }
          quantity = diff_quantity;
        }

      } else {

        var sum_quantity = old_tx.quantity + tx.quantity;
        if (old_tx.operation == 'Add' && tx.operation == 'Remove')
          edit_op = 'Remove'
        else if (old_tx.operation == 'Remove' && tx.operation == 'Add')
          edit_op = 'Add'
        else
          cosole.error('Error in editTransaction: Not supposed to occur')
        quantity = sum_quantity;
      };

      if (this.editStockItem(edit_op,quantity,item)){
        var new_tx = {
          tx_quantity: tx.quantity,
          date: tx.date,
          operation: tx.operation
        };

        restAPI.put('transaction/'+this.transaction_id+ '/',new_tx)
        .then(response => {
          this.emitAlert('Transaction edited succesfully','success')
        }).catch(e => {
          console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
        })
      }
    },
    emitAlert(alert_message,alert_type){
      this.$emit('alertRaised',alert_message,alert_type);
    },
    raiseAlert(message,type){
      this.alert.message = message;
      this.alert.type = type;
      this.alert.raised = true;
    },
    closeAlert(){
      this.alert.message = '';
      this.alert.type = '';
      this.alert.raised = false
    }
  },
  created: function() {
    if (this.mode == 'Edit')
      this.fetchTransaction(this.transaction_id)
  },
  components: {
    Alert
  }
}
</script>

<style lang="css">

.form-control-inline {
    min-width: 0;
    width: 50px;
    display: inline-block;
    vertical-align: middle;
}
</style>
