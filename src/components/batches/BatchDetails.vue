<template>
  <div class="details">
    <div class="container">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <router-link class="btn btn-default" :to="{name: 'Batches'}">Back</router-link>
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

export default {
  name: 'batchdetails',
  data () {
    return {
      batch: {
        'centre_exp': {},
      },
      alert:{
        message: '',
        type: '',
        raised: false
      },
    }
  },
  methods:{
      fetchBatch(id){
          this.$http.get('http://127.0.0.1:8000/api/batch/'+id + '/')
          .then(function(response){
            this.batch = response.body;
          });
      },
      deleteBatch(id){
          this.$http.delete('http://127.0.0.1:8000/api/batch/'+id + '/')
          .then(function(response){
            this.$router.push({name: 'Batches', query: {alert: 'Batch Deleted'}});
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
