<template>
  <div class="batches">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 v-if="!usedAsChild" class="page-header">
      Manage Batches
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddBatch'}">Add Batch</router-link>
      </span>
    </h1>
    <h2 v-else class="page-header">
      Manage Batches
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddBatch'}">Add Batch</router-link>
      </span>
    </h2>
    <input class="form-control" placeholder="Enter Day" v-model="filterInput">
    <br />
    <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Day</th>
            <th>Timing</th>
            <th>Level</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in filterBy(batches, filterInput)">
            <td>{{batch.id}}</td>
            <td>{{batch.day}}</td>
            <td>{{batch.timing}}</td>
            <td>{{batch.level_detail}}</td>
            <td><router-link class="btn btn-default" :to="{name: 'BatchDetails',params: {id: batch.id}}">View</router-link></td>
          </tr>
        </tbody>
    </table>
  </div>
</div>
</template>

<script>
  import Alert from '@/components/Alert';

  export default {
    name: 'batches',
    props: {
      batch_prop: Array,
      isChild: Boolean
    },
    data () {
      return {
        batches: [],
        alert:{
          message: '',
          type: '',
          raised: false
        },
        filterInput:'',
      }
    },
    methods: {
      fetchBatches(){
        this.$http.get('http://127.0.0.1:8000/api/batch/')
          .then(function(response){
            this.batches = response.body;
          });
      },
      filterBy(list, value){
        value = value.charAt(0).toUpperCase() + value.slice(1);
        return list.filter(function(batch){
          return batch.day.indexOf(value) > -1;
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
      if(this.$route.query.alert && !this.isChild){
        this.raiseAlert(this.$route.query.alert,'success');
      };
      if (!this.isChild)
        this.fetchBatches();
    },
    watch: {
      batch_prop: function(val){
        if (val != undefined) {
          this.batches = val;
        }
      }
    },
    // updated: function(){
    //   this.fetchBatches();
    // },
    computed: {
      usedAsChild: function() {
        return !(this.batch_prop == undefined)
      }
    },
    components: {
      Alert,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
