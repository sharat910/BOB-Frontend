<template>
  <div class="details">

    <div class="container">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <router-link class="btn btn-default" :to="{name: 'Teachers'}">Back</router-link>
    <h1 class="page-header">{{teacher.name}}
        <span class="pull-right">
            <router-link class="btn btn-primary" :to="{name:'EditTeacher',props:{id:teacher.id}}">Edit</router-link>
            <button class="btn btn-danger" v-on:click="deleteTeacher(teacher.id)">Delete</button>
            </span>
    </h1>
    <form class="form-horizontal">
      <div class="well">

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Trained upto </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{teacher.trained_max_level_detail}} </li>
          </div>
        </div>

      </div>
      <div class="well">
        <div class="form-group ">
          <label class="col-sm-2 control-label "> Phone </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{teacher.phone}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Email </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{teacher.email}} </li>
          </div>
        </div>
      </div>
    </form>
  </div>
  <SalaryRecordList
    :teacher_id="this.teacher.id"
    :batches="this.teacher.batches"
    :salaryrecords="this.teacher.salaryrecords"
    @salaryUpdated="refetchTeacher()"
    />

  <Batches
    :batch_prop="this.teacher.batches"
    :isChild="true"
    />
</div>

</template>

<script>
import SalaryRecordList from '@/components/salary/SalaryRecordList';
import Batches from '@/components/batches/Batches';
import Alert from '@/components/Alert';
import {restAPI} from '@/services/rest-api';

export default {
  name: 'teacherdetails',
  data () {
    return {
      teacher: '',
      alert:{
        message: '',
        type: '',
        raised: false
      },
    }
  },
  methods:{
      fetchTeacher(id){
          restAPI.get('teacher/'+id + '/')
          .then(response => {
            this.teacher = response.data;
          }).catch(e => {
            console.error(e);console.error(e.response)
          })
      },
      refetchTeacher: function () {
        console.log("salaryUpdated called");
          setTimeout(this.fetchTeacher,500,this.teacher.id);
      },
      deleteTeacher(id){
          restAPI.delete('teacher/'+id + '/')
          .then(response => {
            this.$router.push({name: 'Teachers', query: {alert: 'Teacher Deleted'}});
          }).catch(e => {
            console.error(e);console.error(e.response)
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
  created: function(){
    if(this.$route.query.alert){
      this.raiseAlert(this.$route.query.alert,'success');
    };
    this.fetchTeacher(this.$route.params.id);
  },
  components: {
    SalaryRecordList,
    Batches,
    Alert
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
