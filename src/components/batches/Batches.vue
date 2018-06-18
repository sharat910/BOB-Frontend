<template>
  <div class="batches">
    <TopBar v-if="batch_prop == undefined" entity='Batch'/>
  <div :class="div_class">
    <Alert v-if="alert" v-bind:message="alert" />
    <h1 v-if="batch_prop == undefined" class="page-header">Manage Batches</h1>
    <h2 v-if="batch_prop != undefined" class="page-header">Manage Batches</h2>
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
            <td><router-link class="btn btn-default" v-bind:to="'/batch/'+batch.id">View</router-link></td>
          </tr>
        </tbody>
    </table>
  </div>
</div>
</template>

<script>
  import Alert from '@/components/Alert';
  import TopBar from '@/components/TopBar';

  export default {
    name: 'batches',
    props: {
      batch_prop: Array
    },
    data () {
      return {
        batches: [],
        alert:'',
        filterInput:'',
        div_class: ''
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
      }
    },
    created: function(){
      if(this.$route.query.alert){
        this.alert = this.$route.query.alert;
      };
      this.fetchBatches();
      this.div_class = "container";
    },
    watch: {
      batch_prop: function(val){
        if (val != undefined) {
          this.batches = val;
          this.div_class = "";
        }
      },
    },
    // updated: function(){
    //   this.fetchBatches();
    // },
    components: {
      Alert,TopBar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
