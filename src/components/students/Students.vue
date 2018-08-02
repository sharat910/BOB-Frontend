<template>
  <div class="students">

  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <loading :active.sync="loading" :can-cancel="false" :is-full-page="true"></loading>
    <h1 v-if="!isChild" class="page-header">
      Manage Students
      <button @click="show_only_unpaid=true" v-if="show_only_unpaid==false" class="btn btn-danger">{{unpaid_students}}/{{total_students}} Fee Due</button>
      <button @click="show_only_unpaid=false" v-else class="btn btn-primary">Show all</button>
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddStudent'}">Add Student</router-link>
      </span>
    </h1>
    <h2 v-else class="page-header">
      Manage Students
      <button @click="show_only_unpaid=true" v-if="show_only_unpaid==false" class="btn btn-danger">{{unpaid_students}}/{{total_students}} Fee Due</button>
      <button @click="show_only_unpaid=false" v-else class="btn btn-primary">Show all</button>
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddStudent'}">Add Student</router-link>
      </span>
    </h2>
    <input class="form-control" placeholder="Enter Name" v-model="filterInput">
    <br />
    <table class="table table-striped">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Batch</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filterUnpaid(filterBy(students, filterInput))" :class="{ 'danger' : student.dues.due, '' : !student.dues.due, 'info': student.graduated, 'warning': student.dropped }">
            <td>{{student.code}}</td>
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
  import {restAPI} from '@/services/rest-api';

  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.min.css';


  export default {
    name: 'students',
    props: {
      isChild: Boolean,
      student_prop: Array
    },
    data () {
      return {
        students: [],

        unpaid_students: 0,
        total_students: 0,

        show_only_unpaid: false,
        loading: false,

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
        this.loading = true
        restAPI.get('student/')
          .then(response => {
            this.loading = false
            this.students = response.data;
          }).catch(e => {
            console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
          })
      },
      filterBy(list, value){
        value = value.charAt(0).toUpperCase() + value.slice(1);
        return list.filter(function(student){
          return student.name.indexOf(value) > -1;
        });
      },
      filterUnpaid(list){
        if (this.show_only_unpaid){
          return list.filter(function(student){
            return student.dues.due
          })
        }else{
          return list;
        }
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
    mounted: function(){
      if(this.$route.query.alert && !this.isChild)
        this.raiseAlert(this.$route.query.alert,'success');
        if (!this.isChild)
          this.fetchStudents();
    },
    watch: {
      student_prop: function(val){
        if (val != undefined) {
          this.students = val;
        }
      },
      students: function(students){
        console.log("Watcher exec")
        var n = 0;
        for (var i in students){
          if (students[i].dues.due)
            n += 1
        }
        this.unpaid_students = n;
        this.total_students = students.length;
      }
    },
    components: {
      Alert,
      Loading
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
