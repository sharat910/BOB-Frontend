<template lang="html">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 class="page-header"> Expenditure Records
      <span class="pull-right">
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#expenditureModal"
        data-backdrop="static" data-keyboard="false">Add Record</button>
      </span>
    </h1>

  <table class="table table-striped">
      <thead>
        <tr>
          <th>Voucher ID</th>
          <th>Description</th>
          <th>Date</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in expenditures">
          <td>{{e.voucher_id}}</td>
          <td>{{e.description}}</td>
          <td>{{e.date}}</td>
          <td>{{e.amount}}</td>
          <td>
          <button @click="launch_form=true;mode='Edit';expenditure_id=e.id" class="btn btn-default"
            data-toggle="modal" data-target="#expenditureModal" data-backdrop="static" data-keyboard="false">
            Edit
          </button>
             <button class="btn btn-danger" @click="deleteExpenditureRecord(e.id);">Delete</button>
          </td>
        </tr>
      </tbody>
  </table>
  <div id="expenditureModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Expenditure Record</h4>
        </div>
        <div class="modal-body">
          <ExpenditureForm v-if="launch_form"
          :mode="this.mode"
          :expenditure_id="this.expenditure_id"
          v-on:expenditureUpdated="fetchExpenditures()"
          />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>

import ExpenditureForm from '@/components/expenditure/ExpenditureForm';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'expenditurerecordlist',
  data() {
      return {
        mode: '',
        alert:{
          message: '',
          type: '',
          raised: false
        },
        expenditure_id: 0,
        launch_form: false,
        expenditures: []
      }
  },
  methods: {
    deleteExpenditureRecord(id){
        restAPI.delete('expenditure/'+id + '/')
        .then(response => {
          this.raiseAlert('Expenditure record deleted succesfully');
          this.waitAndFetchExpenditures();
        }).catch(e => {
          console.error(e);console.error(e.response)
        })
    },
    fetchExpenditures(){
      restAPI.get('expenditure/')
      .then(response => {
        this.expenditures = response.data;
      }).catch(e => {
        console.error(e);console.error(e.response)
      })
    },
    waitAndFetchExpenditures(){
      setTimeout(this.fetchExpenditures,300);
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
    this.fetchExpenditures();
  },
  components: {
    ExpenditureForm,
    Alert
  }
}
</script>

<style lang="css">
</style>
