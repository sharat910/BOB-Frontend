<template>
  <div class="students">

  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 v-if="student_prop == undefined" class="page-header">
      Manage Students
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddStudent'}">Add Student</router-link>
      </span>
    </h1>
    <h2 v-else class="page-header">
      Manage Students
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddStudent'}">Add Student</router-link>
      </span>
    </h2>
    <input class="form-control" placeholder="Enter Name" v-model="filterInput">
    <br />
    <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Batch</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filterBy(students, filterInput)">
            <td>{{student.id}}</td>
            <td>{{student.name}}</td>
            <td>{{student.batch_details}}</td>
            <td><router-link class="btn btn-default" :to="{name: 'StudentDetails',params: {id: student.id}}">View</router-link></td>
          </tr>
        </tbody>
    </table>
  </div>
</div>
</template>

<script>
  import Alert from '@/components/Alert';

  export default {
    name: 'students',
    props: {
      batch: Number,
      student_prop: Array
    },
    data () {
      return {
        students: [],
        alert:{
          message: '',
          type: '',
          raised: false
        },
        filterInput:''
      }
    },
    methods: {
      fetchStudents(){
        this.$http.get('http://127.0.0.1:8000/api/student/')
          .then(function(response){
            this.students = response.body;
          });
      },
      filterBy(list, value){
        value = value.charAt(0).toUpperCase() + value.slice(1);
        return list.filter(function(student){
          return student.name.indexOf(value) > -1;
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
      if(this.$route.query.alert)
        this.raiseAlert(this.$route.query.alert,'success');
      this.fetchStudents();
    },
    watch: {
      student_prop: function(val){
        if (val != undefined) {
          this.students = val;
        }
      },
    },
    // updated: function(){
    //   this.fetchStudents();
    // },
    components: {
      Alert,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
