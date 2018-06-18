<template>
  <div class="details">
    <TopBar entity='Teacher'/>
    <div class="container">
    <h1 class="page-header">{{teacher.name}}
        <span class="pull-right">
            <router-link class="btn btn-primary" v-bind:to="'/edit/teacher/'+teacher.id">Edit</router-link>
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

    <SalaryRecordList
      :teacher_id="this.teacher.id"
      :batches="this.teacher.batches"
      :salaryrecords="this.teacher.salaryrecords"
      />

    <Batches
      :batch_prop="this.teacher.batches"
      />
  </div>

</div>

</template>

<script>
import TopBar from '@/components/TopBar';
import SalaryRecordList from '@/components/salary/SalaryRecordList';
import Batches from '@/components/batches/Batches'

export default {
  name: 'teacherdetails',
  data () {
    return {
      teacher: ''
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
      }
  },
  created: function(){
      this.fetchTeacher(this.$route.params.id);
  },
  components: {
    TopBar,
    SalaryRecordList,
    Batches
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
