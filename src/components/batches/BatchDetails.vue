<template>
  <div class="details">
    <div class="container">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <router-link class="btn btn-default" :to="{name: 'Batches'}">Back</router-link>
    <h1 class="page-header">{{batch.summary}}
        <span class="pull-right">
          <router-link class="btn btn-primary" :to="{name:'EditBatch',props: {id:batch.id}}">Edit</router-link>
          <button class="btn btn-danger" v-on:click="deleteBatch(batch.id)">Delete</button>
        </span>
    </h1>
    <ul class="list-group">
            <li class="list-group-item"><span class="glyphicon glyphicons-stopwatch" aria-hidden="true"></span>  {{batch.timing}}</li>
            <li class="list-group-item"><span class="glyphicon glyphicons-calendar" aria-hidden="true"></span>  {{batch.day}}</li>
    </ul>
    <br>
    <ul class="list-group">
            <li class="list-group-item"><span class="glyphicon glyphicons-cup" aria-hidden="true"></span> {{batch.level_detail}}</li>
            <li class="list-group-item"><span class="glyphicon glyphicons-woman" aria-hidden="true"></span> {{batch.teacher_name}}</li>
    </ul>
    <br>
  </div>
  <Students v-bind:student_prop="batch.students" />
</div>
</template>

<script>
import Students from '@/components/students/Students';
import Alert from '@/components/Alert';

export default {
  name: 'batchdetails',
  data () {
    return {
      batch: '',
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
