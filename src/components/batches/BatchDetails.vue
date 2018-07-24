<template>
  <div class="details">
    <div class="container">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>

    <div class="top">
        <router-link class="btn btn-default" :to="{name: 'Batches'}">Back</router-link>
        <span class="pull-right">
        <div class="form-inline">
          <div class="form-group">

            <label class="col-sm-4 control-label ">
              Statement Month
            </label>


            <div class="col-sm-4">
              <select class="form-control" name="level" v-model="statement_month">
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
              </select>
            </div>
          </div>

          <button @click="downloadStatement()" class="btn" title="Download the monthly statement">Download</button>
      </div>
    </span>

    </div>

    <h1 class="page-header">{{batch.level_detail}} | {{batch.teacher_name}}
        <span class="pull-right">
          <router-link class="btn btn-primary" :to="{name:'EditBatch',props: {id:batch.id}}">Edit</router-link>
          <button class="btn btn-danger" v-on:click="deleteBatch(batch.id)">Delete</button>
        </span>
    </h1>

    <form class="form-horizontal">
      <div class="well">

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Day </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{batch.day}} </li>
          </div>
        </div>


        <div class="form-group ">
          <label class="col-sm-2 control-label "> Timing </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{batch.timing}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Centre </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{batch.centre_exp.name}} </li>
          </div>
        </div>
      </div>

      <div class="well">

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Level </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{batch.level_detail}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Level Start Date</label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{batch.level_start_date}} </li>
          </div>
        </div>

      </div>

      <div class="well">

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Teacher </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{batch.teacher_name}} </li>
          </div>
        </div>

      </div>
    </form>
    <br>
  </div>
  <Students
  :isChild="true"
  :student_prop="batch.students"
  />
</div>
</template>

<script>
import Students from '@/components/students/Students';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';
import axios from 'axios';

export default {
  name: 'batchdetails',
  data () {
    return {
      batch: {
        'centre_exp': {},
      },
      statement_month: -1,
      alert:{
        message: '',
        type: '',
        raised: false
      },
    }
  },
  methods:{
      fetchBatch(id){
          restAPI.get('batch/'+id + '/')
          .then(response => {
            this.batch = response.data;
          }).catch(e => {
            console.error(e);console.error(e.response)
          })
      },
      deleteBatch(id){
          restAPI.delete('batch/'+id + '/')
          .then(response => {
            this.$router.push({name: 'Batches', query: {alert: 'Batch Deleted'}});
          }).catch(e => {
            console.error(e);console.error(e.response)
          })
      },
      downloadStatement(){
        var data = {
          'batch': this.batch,
          'month': parseInt(this.statement_month)
        }
        restAPI.post('batch/' + this.batch.id + '/generate_monthly_statement/',data)
        .then(response => {
          var url = response.data['url'];
          var final_url = restAPI.defaults.baseURL.slice(0,-3) + url
          console.log(final_url)
          this.downloadFile(final_url)
        }).catch(e => {
          console.error(e);console.error(e.response)
        })
      },
      downloadFile(complete_url){
        axios({
          url: complete_url,
          method: 'GET',
          responseType: 'blob', // important
          headers: { 'Accept': 'application/vnd.ms-excel' }
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          var file_name = complete_url.split("/").pop()
          link.setAttribute('download', file_name);
          document.body.appendChild(link);
          link.click();
        });
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
    this.fetchBatch(this.$route.params.id);
  },
  components: {
    Students,
    Alert
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
