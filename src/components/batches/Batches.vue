<template>
  <div class="batches">
  <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 v-if="!isChild" class="page-header">
      Manage Batches
      <button @click="show_only_exam=true" v-if="show_only_exam==false" class="btn btn-danger">{{exam_batches}}/{{total_batches}} Exams</button>
      <button @click="show_only_exam=false" v-else class="btn btn-primary">Show all</button>
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddBatch'}">Add Batch</router-link>
      </span>
    </h1>
    <h2 v-else class="page-header">
      Manage Batches
      <button @click="show_only_exam=true" v-if="show_only_exam==false" class="btn btn-danger">{{exam_batches}}/{{total_batches}} Exams</button>
      <button @click="show_only_exam=false" v-else class="btn btn-primary">Show all</button>
      <span class="pull-right">
        <router-link class="btn btn-success" :to="{ name: 'AddBatch'}">Add Batch</router-link>
      </span>
    </h2>
    <input class="form-control" placeholder="Enter Day" v-model="filterInput">
    <br />
    <table class="table table-striped">
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Day</th>
            <th>Timing</th>
            <th>Level</th>
            <th>Centre</th>
            <th># Students</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in filterExam(filterBy(batches, filterInput))" :class="{ 'danger' : batch.exam_this_month, '' : !batch.exam_this_month }">
            <td>{{batch.teacher_name}}</td>
            <td>{{batch.day}}</td>
            <td>{{batch.timing}}</td>
            <td>{{batch.level_detail}}</td>
            <td>{{batch.centre_exp.name}}</td>
            <td>{{batch.num_of_students}}</td>
            <td><router-link class="btn btn-default" :to="{name: 'BatchDetails',params: {id: batch.id}}">View</router-link></td>
          </tr>
        </tbody>
    </table>
  </div>
</div>
</template>

<script>
  import Alert from '@/components/Alert';
  import {restAPI} from '@/services/rest-api';

  export default {
    name: 'batches',
    props: {
      batch_prop: Array,
      isChild: Boolean
    },
    data () {
      return {
        batches: [],
        exam_batches: 0,
        total_batches: 0,
        show_only_exam: false,
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
        restAPI.get('batch/')
        .then(response => {
          this.batches = response.data;
        }).catch(e => {
          console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
        })
      },
      filterBy(list, value){
        value = value.charAt(0).toUpperCase() + value.slice(1);
        return list.filter(function(batch){
          return batch.day.indexOf(value) > -1;
        });
      },
      filterExam(list){
        if (this.show_only_exam){
          return list.filter(function(batch){
            return batch.exam_this_month
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
      },
      batches: function(batches){
        var n = 0;
        for (var i in batches){
          if (batches[i].exam_this_month)
            n += 1
        }
        this.exam_batches = n;
        this.total_batches = batches.length;
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
