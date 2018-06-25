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
    <ul class="list-group">
            <li class="list-group-item"><span class="glyphicon glyphicon-phone" aria-hidden="true"></span>  {{teacher.phone}}</li>
            <li class="list-group-item"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>  {{teacher.email}}</li>
    </ul>
    <br>
    <ul class="list-group">
            <li class="list-group-item"><span class="glyphicon glyphicons-cup" aria-hidden="true"></span> Trained upto {{teacher.trained_max_level_detail}}</li>
    </ul>
  </div>
  <SalaryRecordList
    :teacher_id="this.teacher.id"
    :batches="this.teacher.batches"
    :salaryrecords="this.teacher.salaryrecords"
    />

  <Batches
    :batch_prop="this.teacher.batches"
    />
</div>

</template>

<script>
import SalaryRecordList from '@/components/salary/SalaryRecordList';
import Batches from '@/components/batches/Batches';
import Alert from '@/components/Alert';

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
          this.$http.get('http://127.0.0.1:8000/api/teacher/'+id + '/')
          .then(function(response){
            this.teacher = response.body;
          });
      },
      deleteTeacher(id){
          this.$http.delete('http://127.0.0.1:8000/api/teacher/'+id + '/')
          .then(function(response){
            this.$router.push({name: 'Teachers', query: {alert: 'Teacher Deleted'}});
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
