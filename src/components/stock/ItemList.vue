<template lang="html">
  <div class="container">
    <Alert v-if="alert.raise" :message="alert.message" :type="alert.type" :show="true"/>
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
            <TransactionForm :item="item" @alertRaised="alertRaised"/>
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

export default {
  name: 'stockitemlist',
  data() {
      return {
        mode: '',
        alert: {
          message: '',
          type: 'info',
          raise: false
        },
        item_id: 0,
        launch_form: false,
        items: []
      }
  },
  methods: {
    fetchItems(){
      this.$http.get('http://127.0.0.1:8000/api/item/')
      .then(function(response){
        this.items = response.data;
      });
    },
    waitAndFetchItems(){
      setTimeout(this.fetchItems,300);
    },
    // itemUpdated: function(new_item){
    //   var item_index = this.items.find(function (obj) { return obj.id === new_item.id; });
    //   this.items[item_index] = new_item;
    // },
    alertRaised: function(alert){
      this.alert.message = alert.message;
      this.alert.type = alert.type;
      this.alert.raise = true
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
