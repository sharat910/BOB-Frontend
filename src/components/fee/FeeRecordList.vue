<template lang="html">
  <div class="feerecords container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h2 class="page-header"> Fee Records
      <span class="pull-right">
        <button type="button" v-if="!viewtable" @click="viewtable=true;"class="btn btn-default">View Records</button>
        <button type="button" v-if="viewtable" @click="viewtable=false;"class="btn btn-default">Hide Records</button>
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#feeModal"
        data-backdrop="static" data-keyboard="false">Add Record</button>
      </span>
    </h2>

  <table v-if="viewtable" class="table table-striped">
      <thead>
        <tr>
          <th>Fee Receipt No</th>
          <th>Fee Type</th>
          <th>Date of Payement</th>
          <th>Level</th>
          <th>Month(s)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fee in feerecords">
          <td>{{fee.fee_receipt_no}}</td>
          <td>{{fee.fee_type}}</td>
          <td>{{fee.date_of_payment}}</td>
          <td>{{fee.level}}</td>
          <td>{{fee.month_names}}</td>
          <td>
          <button @click="launch_form=true;mode='Edit';fee_id=fee.id" class="btn btn-default"
            data-toggle="modal" data-target="#feeModal" data-backdrop="static" data-keyboard="false">
            Edit
          </button>
             <button class="btn btn-danger" @click="deleteFeeRecord(fee.id);$emit('feeUpdated')">Delete</button>
          </td>
        </tr>
      </tbody>
  </table>
  <div id="feeModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Fee Record</h4>
        </div>
        <div class="modal-body">
          <FeeForm v-if="launch_form"
          :student_id="this.student_id"
          :mode="this.mode"
          :fee_id="this.fee_id"
          :batch="this.batch"
          v-on:feeUpdated="$emit('feeUpdated')"
          />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>

import FeeForm from '@/components/fee/FeeForm';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'feerecordlist',
  props: {
    feerecords: Array,
    student_id: Number,
    batch: Object
  },
  data() {
      return {
        mode: '',
        alert:{
          message: '',
          type: '',
          raised: false
        },
        fee_id: 0,
        launch_form: false,
        viewtable: false
      }
  },
  methods: {
    deleteFeeRecord(id){
        restAPI.delete('feerecord/'+id + '/')
        .then(response => {
          this.raiseAlert('Fee record deleted succesfully','success');
        }).catch(e => {
          console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
        })
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
  components: {
    FeeForm,
    Alert
  }
}
</script>

<style lang="css">
</style>
