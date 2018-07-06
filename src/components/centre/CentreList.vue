<template lang="html">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 class="page-header"> Centres
      <span class="pull-right">
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#centreModal"
        data-backdrop="static" data-keyboard="false">Add Centre</button>
      </span>
    </h1>

  <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Code</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="centre in centres">
          <td>{{centre.id}}</td>
          <td>{{centre.name}}</td>
          <td>{{centre.code}}</td>
          <td>
          <button @click="launch_form=true;mode='Edit';centre_id=centre.id" class="btn btn-default"
            data-toggle="modal" data-target="#centreModal" data-backdrop="static" data-keyboard="false">
            Edit
          </button>
             <button class="btn btn-danger" @click="deleteCentreRecord(centre.id);">Delete</button>
          </td>
        </tr>
      </tbody>
  </table>
  <div id="centreModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Centre Record</h4>
        </div>
        <div class="modal-body">
          <CentreForm v-if="launch_form"
          :mode="this.mode"
          :centre_id="this.centre_id"
          v-on:centreUpdated="fetchCentres()"
          />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>

import CentreForm from '@/components/centre/CentreForm';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'centrerecordlist',
  data() {
      return {
        mode: '',
        alert:{
          message: '',
          type: '',
          raised: false
        },
        centre_id: 0,
        launch_form: false,
        centres: []
      }
  },
  methods: {
    deleteCentreRecord(id){
        restAPI.delete('centre/'+id + '/')
        .then(response => {
          this.raiseAlert('Centre record deleted succesfully');
          this.waitAndFetchCentres();
        }).catch(e => {
          console.error(e)
        });
    },
    fetchCentres(){
      restAPI.get('centre/')
      .then(response => {
        this.centres = response.data;
      }).catch(e => {
        console.error(e)
      })
    },
    waitAndFetchCentres(){
      setTimeout(this.fetchCentres,300);
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
    this.fetchCentres();
  },
  components: {
    CentreForm,
    Alert
  }
}
</script>

<style lang="css">
</style>
