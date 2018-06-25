<template>
  <div class="teachers">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 class="page-header">
      Manage Teachers
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddTeacher'}">Add Teacher</router-link>
      </span>
    </h1>
    <input class="form-control" placeholder="Enter Name" v-model="filterInput">
    <br />
    <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in filterBy(teachers, filterInput)">
            <td>{{teacher.id}}</td>
            <td>{{teacher.name}}</td>
            <td>{{teacher.phone}}</td>
            <td><router-link class="btn btn-default" :to="{name: 'TeacherDetails',params: {id: teacher.id}}">View</router-link></td>
          </tr>
        </tbody>
    </table>
  </div>
</div>
</template>

<script>
  import Alert from '@/components/Alert';

  export default {
    name: 'teachers',
    props: {
      batch: Number
    },
    data () {
      return {
        teachers: [],
        alert:{
          message: '',
          type: '',
          raised: false
        },
        filterInput:''
      }
    },
    methods: {
      fetchTeachers(){
        this.$http.get('http://127.0.0.1:8000/api/teacher/')
          .then(function(response){
            this.teachers = response.body;
          });
      },
      filterBy(list, value){
        value = value.charAt(0).toUpperCase() + value.slice(1);
        return list.filter(function(teacher){
          return teacher.name.indexOf(value) > -1;
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
        this.raiseAlert(this.$route.query.alert);
      }
      this.fetchTeachers();
    },
    // updated: function(){
    //   this.fetchTeachers();
    // },
    components: {
      Alert
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
