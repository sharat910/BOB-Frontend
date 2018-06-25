<template lang="html">
  <div class="container">
    <Alert v-if="alert.raise" :message="alert.message" :type="alert.type" :show="true"/>
    <h2 class="page-header"> Transactions
      <span class="pull-right">
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#transactionModal"
        data-backdrop="static" data-keyboard="false">Add Transaction</button>
      </span>
    </h2>

  <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Operation</th>
          <th>Quantity</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions">
          <td>{{transaction.id}}</td>
          <td>{{transaction.date}}</td>
          <td>{{transaction.operation}}</td>
          <td>{{transaction.tx_quantity}}</td>
          <td>
          <button @click="launch_form=true;mode='Edit';transaction_id=transaction.id" class="btn btn-default"
            data-toggle="modal" data-target="#transactionModal" data-backdrop="static" data-keyboard="false">
            Edit
          </button>
             <button class="btn btn-danger" @click="deleteTransactionRecord(transaction);">Delete</button>
          </td>
        </tr>
      </tbody>
  </table>

  <div id="transactionModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Transaction</h4>
        </div>
        <div class="modal-body">
          <TransactionForm v-if="launch_form"
          :mode="this.mode"
          :item="this.item"
          :transaction_id="transaction_id"
          :long="true"
          @alertRaised="raiseAlertListener"
          ref="tx_form"
          />
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import TransactionForm from '@/components/stock/TransactionForm';
import Alert from '@/components/Alert'

export default {
  name: 'transactionlist',
  props: {
    transactions: Array,
    item: Object
  },
  data() {
    return {
      alert: {
        message: '',
        type: 'info',
        raise: false
      },
      transaction_id: 0,
      mode: '',
      launch_form: false
    }
  },
  methods: {
    raiseAlertListener: function(alert){
      this.alert.message = alert.message;
      this.alert.type = alert.type;
      this.alert.raise = true;
      if (alert.type === 'success')
        this.$emit('transactionsUpdated')
    },
    raiseAlert: function(msg,type){
      var alert = {
        message: msg,
        type: type
      };
      this.raiseAlertListener(alert);
    },
    deleteTransactionRecord: function(tx){
      var edit_op = (tx.operation === 'Add') ? 'Remove':'Add';
      console.log("edit op",edit_op)
      if (this.editStockItem(edit_op,tx.tx_quantity,this.item)){
        this.$http.delete('http://localhost:8000/api/transaction/' + tx.id + '/')
        .then(function(response){
          this.raiseAlert('Transaction deleted succesfully','success');
        });
      }
      else
        raiseAlert('Transaction delete failed','danger');
    },
    editStockItem(tx_op,tx_quantity,item){
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
            this.raiseAlert("Items requested: " + tx_quantity +
            " | Items available: " + itemsAvailable,'danger');
            result=false;
          } else{
            item.quantity = 0;
            item.reserve_quantity -= diff;
          }
        }
      }
      if (result != false){
        this.$http.put('http://localhost:8000/api/item/' + item.id + '/', item)
            .then(function(response){
              this.raiseAlert('Item: ' + item.description + '  |  Quantity edited','info');
            });

      };
      return result;
    },
  },
  components: {
    Alert,
    TransactionForm
  }
}
</script>

<style lang="css">
</style>
