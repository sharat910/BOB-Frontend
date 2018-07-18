<template>
  <div class="details">
    <div class="container">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
      <router-link class="btn btn-default" :to="{name: 'Students'}">Back</router-link>

    <h1 class="page-header">{{student.name}}
        <span class="pull-right">
            <button type="button" v-if="!additional_details" @click="additional_details=true" class="btn btn-info">More details</button>
            <button type="button" v-else @click="additional_details=false" class="btn btn-info">Hide details</button>
            <router-link class="btn btn-primary" :to="{name:'EditStudent',props: {id:student.id}}">Edit</router-link>
            <button class="btn btn-danger" v-on:click="deleteStudent(student.id)">Delete</button>
            </span>
    </h1>
    <form class="form-horizontal">
      <div class="well">

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Code </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.code}} </li>
          </div>
        </div>


        <div class="form-group ">
          <label class="col-sm-2 control-label "> Batch Details </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.batch_details}} </li>
          </div>
        </div>

        <div v-if="additional_details" class="form-group ">
          <label class="col-sm-2 control-label "> Performance </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.performance_rating}} </li>
          </div>
        </div>

        <div v-if="additional_details" class="form-group ">
          <label class="col-sm-2 control-label "> Date of joining </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.date_of_joining}} </li>
          </div>
        </div>

      </div>


      <div class="well">
        <!-- <h4>Contact</h4> -->

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Phone </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.phone}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Alt Phone </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.alt_phone}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Email </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.email}} </li>
          </div>
        </div>

      </div>

      <div class="well">
        <div class="form-group ">
          <label class="col-sm-2 control-label "> Father's Name </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.father_name}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> Mother's Name </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.mother_name}} </li>
          </div>
        </div>
      </div>

      <div v-if="additional_details" class="well">
        <div class="form-group ">
          <label class="col-sm-2 control-label "> Date of Birth </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.date_of_birth}} </li>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label "> T-shirt Size </label>
          <div class="col-sm-10">
            <li class="list-group-item"> {{student.t_shirt_size}} </li>
          </div>
        </div>
      </div>
    </form>
    <br>
    </div>
    <FeeRecordList :feerecords="student.feerecords" :student_id="student.id" v-on:feeUpdated="refetchStudent()"/>
    <ExamResultList :examresults="student.examresults" :student_id="student.id" v-on:examUpdated="refetchStudent()"/>
</div>
</template>

<script>
import Alert from '@/components/Alert';
import FeeRecordList from '@/components/fee/FeeRecordList';
import ExamResultList from '@/components/exam/ExamResultList';
import {restAPI} from '@/services/rest-api';

//Helper functions to get useful attributes
function pick(obj, keys) {
    return keys.map(k => k in obj ? {[k]: obj[k]} : {})
               .reduce((res, o) => Object.assign(res, o), {});
}

function reject(obj, keys) {
    const vkeys = Object.keys(obj)
        .filter(k => !keys.includes(k));
    return pick(obj, vkeys);
}

function capitalize_first_letter(txt) {
    return txt.charAt(0).toUpperCase() +  txt.slice(1);
}

function generate_form_label(key){
    // console.log("here");
    var str = key.replace(/_/gi," ");
    // console.log(str);
    var label = capitalize_first_letter(str);
    // console.log(label);
    return label
}



export default {
  name: 'studentdetails',
  data () {
    return {
      student: {},
      alert:{
        message: '',
        type: '',
        raised: false
      },
      additional_details: false
    }
  },
  methods:{
      fetchStudent(id){
          restAPI.get('student/'+id + '/')
          .then(response => {
            this.student = response.data;
          }).catch(e => {
            console.error(e);console.error(e.response)
          })
      },
      deleteStudent(id){
          restAPI.delete('student/'+id + '/')
          .then(response => {
            this.$router.push({name: 'Students', query: {alert: 'Student deleted succesfully.'}});
          }).catch(e => {
            console.error(e);console.error(e.response)
          })
      },
      refetchStudent: function () {
        console.log("feeUpdated called");
          setTimeout(this.fetchStudent,500,this.student.id);
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
    this.fetchStudent(this.$route.params.id);
  },
  computed: {
    student_details: function(){
      var reject_fields = ['id', 'feerecords','name','dropped','date_dropped','photo','batch'];
      var student_filt = reject(this.student,reject_fields);
      var student_details = {};
      for (var key in student_filt) {
        var form_label = generate_form_label(key);
        student_details[form_label] = student_filt[key];
      };
      return student_details;
    }
  },
  components: {
    FeeRecordList,
    ExamResultList,
    Alert
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
