<template lang="html">
  <div class="salaryrecords container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h2 class="page-header"> Salary Records
      <span class="pull-right">
        <button type="button" v-if="!viewtable" @click="viewtable=true;"class="btn btn-default">View Records</button>
        <button type="button" v-if="viewtable" @click="viewtable=false;"class="btn btn-default">Hide Records</button>
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#salaryModal"
        data-backdrop="static" data-keyboard="false">Add Record</button>
      </span>
    </h2>

  <table v-if="viewtable" class="table table-striped">
      <thead>
        <tr>
          <th>Date of Payment</th>
          <th>Salary Type</th>
          <th>Batch</th>
          <th>Level</th>
          <th>Month(s)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="salary in salaryrecords">
          <td>{{salary.date_of_payment}}</td>
          <td>{{salary.salary_type}}</td>
          <td>{{salary.batch_details}}</td>
          <td>{{salary.level_details}}</td>
          <td>{{salary.month_names}}</td>
          <td>
          <button @click="launch_form=true;mode='Edit';salary_id=salary.id" class="btn btn-default"
            data-toggle="modal" data-target="#salaryModal" data-backdrop="static" data-keyboard="false">
            Edit
          </button>
             <button class="btn btn-danger" @click="deleteSalaryRecord(salary.id);$emit('salaryUpdated')">Delete</button>
          </td>
        </tr>
      </tbody>
  </table>
  <div id="salaryModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Salary Record</h4>
        </div>
        <div class="modal-body">
          <SalaryForm v-if="launch_form"
          :teacher_id="this.teacher_id"
          :mode="this.mode"
          :salary_id="this.salary_id"
          :batches="this.batches"
          v-on:salaryUpdated="$emit('salaryUpdated')"
          />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>

import SalaryForm from '@/components/salary/SalaryForm';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'salaryrecordlist',
  props: {
    salaryrecords: Array,
    batches: Array,
    teacher_id: Number
  },
  data() {
      return {
        mode: '',
        alert:{
          message: '',
          type: '',
          raised: false
        },
        salary_id: 0,
        launch_form: false,
        viewtable: false
      }
  },
  methods: {
    deleteSalaryRecord(id){
        restAPI.delete('salaryrecord/'+id + '/')
        .then(response => {
          this.raiseAlert('Salary record deleted succesfully','success');
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
    SalaryForm,
    Alert
  }
}
</script>

<style lang="css">
</style>
