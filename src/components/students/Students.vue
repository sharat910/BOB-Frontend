<template>
  <div class="students">

  <div class="container">
    <Alert v-if="alert" v-bind:message="alert" />
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
        alert:'',
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
      }
    },
    created: function(){
      if(this.$route.query.alert){
        this.alert = this.$route.query.alert;
      }
      if (this.student_prop == undefined) {
        this.fetchStudents();
      } else {
        this.students = this.student_prop;
      }

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
