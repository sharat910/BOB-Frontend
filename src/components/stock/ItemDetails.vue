<template>
<div class="details">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
  <h1 class="page-header"> Stock Item
      <span class="pull-right">
        <!-- <TransactionForm :item='item' :long='false'/> -->
        <button v-if="!edit" @click="edit=true;" class="btn btn-default"> Edit </button>
        <button class="btn btn-danger" v-on:click="deleteItem(item.id)">Delete</button>
      </span>
  </h1>

  <div class="data">
    <div class="col-sm-6">

      <div class="form-horizontal">
        <div class="well">
      <div class="form-group ">
        <label class="col-sm-2 control-label "> Description </label>
        <div class="col-sm-10">
          <li v-if="!edit" class="list-group-item"> {{item.description}} </li>
          <input v-if="edit" class="form-control" type="text" v-model="item.description" name="" value="">
        </div>
      </div>


      <div class="form-group ">
        <label class="col-sm-2 control-label "> Level </label>
        <div class="col-sm-10">
          <li v-if="!edit" class="list-group-item"> {{item.level_name}} </li>
          <select v-if="edit" class="form-control" name="level" v-model="item.level">

              <option value="" selected="">--------</option>
                  <option value="1">Level-1</option>
                  <option value="2">Level-2</option>
                  <option value="3">Level-3</option>
                  <option value="4">Level-4</option>
                  <option value="5">Level-5</option>
                  <option value="6">Level-6</option>
                  <option value="7">Level-7</option>
                  <option value="8">Level-8</option>
                  <option value="9">Level-9</option>
                  <option value="10">Level-10</option>
                  <option value="11">Module-1</option>
                  <option value="12">Module-2</option>
                  <option value="13">Module-3</option>
                  <option value="14">Module-4</option>
          </select>
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label "> Type </label>
        <div class="col-sm-10">
          <li v-if="!edit" class="list-group-item"> {{item.type}} </li>
          <select v-if="edit" class="form-control" name="type" v-model="item.type">
                  <option value="Kit">Kit</option>
                  <option value="Book">Book</option>
                  <option value="Bookset">Bookset</option>
                  <option value="Question Paper">Question Paper</option>
          </select>
        </div>
      </div>
    </div>
    </div>
  </div>




    <div class="col-sm-6">
      <!-- <h4>Contact</h4> -->
      <div class="form-horizontal">
      <div class="well">

      <div class="form-group ">
        <label class="col-sm-2 control-label "> Quantity </label>
        <div class="col-sm-10">
          <li v-if="!edit" class="list-group-item"> {{item.quantity}} </li>
          <input v-if="edit" class="form-control" type="number" v-model="item.quantity" name="" value="">
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label "> Reserve Quantity </label>
        <div class="col-sm-10">
          <li v-if="!edit" class="list-group-item"> {{item.reserve_quantity}} </li>
          <input v-if="edit" class="form-control" type="number" v-model="item.reserve_quantity" name="" value="">
        </div>
      </div>

      <div class="form-group ">
        <label class="col-sm-2 control-label "> Reserve Max </label>
        <div class="col-sm-10">
          <li v-if="!edit" class="list-group-item"> {{item.reserve_quantity_max}} </li>
          <input v-if="edit" class="form-control" type="number" v-model="item.reserve_quantity_max" name="" value="">
        </div>
      </div>

    </div>

    </div>

    <button v-if="edit" @click="edit=false;editItem(item.id);" class="btn btn-default">
      Save
    </button>

    </div>
    </div>

  </div>
<br>
<TransactionList
:transactions="item.transactions"
:item="item"
@transactionsUpdated="refetchItem()"
/>


</div>
</template>

<script>
import Alert from '@/components/Alert';
import TransactionList from '@/components/stock/TransactionList';
import TransactionForm from '@/components/stock/TransactionForm';
import {restAPI} from '@/services/rest-api';

export default {
name: 'itemdetails',
data () {
  return {
    item: {level: {}},
    edit_level: 0,
    alert:{
      message: '',
      type: '',
      raised: false
    },
    edit: false
  }
},
methods:{
    fetchItem(id){
        restAPI.get('item/'+id + '/')
        .then(response => {
          this.item = response.data;
        }).catch(e => {
          console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
        })
    },
    editItem(){
      restAPI.put('item/' + this.item.id + '/', this.item)
          .then(response => {
              this.raiseAlert('Stock Item details edited succesfully.','success');
              this.refetchItem();
          }).catch(e => {
            console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
          })
    },
    deleteItem(id){
        restAPI.delete('item/'+id + '/')
        .then(response => {
          this.$router.push({name: 'Items', query: {alert: 'Stock item deleted succesfully'}});
        }).catch(e => {
          console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
        })
    },
    refetchItem: function () {
        setTimeout(this.fetchItem,500,this.item.id);
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
created: function(){
  if(this.$route.query.alert){
    this.raiseAlert(this.$route.query.alert,'success');
  };
  this.fetchItem(this.$route.params.id);
},
components: {
  TransactionList,
  Alert,
  TransactionForm
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
