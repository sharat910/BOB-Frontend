<template lang="html">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 class="page-header"> Stock Items
      <span class="pull-right">
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#itemModal"
        data-backdrop="static" data-keyboard="false">Add Item</button>
      </span>
    </h1>

  <table class="table table-striped">
      <thead>
        <tr>
          <th>Description</th>
          <th>Type</th>
          <th>Level</th>
          <th>Quantity</th>
          <th>Reserve</th>
          <th>Operations</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{item.description}}</td>
          <td>{{item.type}}</td>
          <td>{{item.level_name}}</td>
          <td>{{item.quantity}}</td>
          <td>{{item.reserve_quantity}}</td>
          <td>
            <TransactionForm :item="item" @alertRaised="raiseAlert"/>
          </td>
          <td><router-link class="btn btn-default" :to="'/stock/item/' + item.id">View</router-link></td>
        </tr>
      </tbody>
  </table>
  <div id="itemModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Stock Item</h4>
        </div>
        <div class="modal-body">
          <ItemForm v-if="launch_form"
          :mode="this.mode"
          :item_id="this.item_id"
          v-on:itemUpdated="fetchItems()"
          />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>

import ItemForm from '@/components/stock/ItemForm';
import TransactionForm from '@/components/stock/TransactionForm';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'stockitemlist',
  data() {
      return {
        mode: '',
        alert:{
          message: '',
          type: '',
          raised: false
        },
        item_id: 0,
        launch_form: false,
        items: []
      }
  },
  methods: {
    fetchItems(){
      restAPI.get('item/')
      .then(response => {
        this.items = response.data;
      }).catch(e => {
        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
      })
    },
    waitAndFetchItems(){
      setTimeout(this.fetchItems,300);
    },
    // itemUpdated: function(new_item){
    //   var item_index = this.items.find(function (obj) { return obj.id === new_item.id; });
    //   this.items[item_index] = new_item;
    // },
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
    this.fetchItems();
  },
  components: {
    TransactionForm,
    ItemForm,
    Alert
  }
}
</script>

<style lang="css">
</style>
