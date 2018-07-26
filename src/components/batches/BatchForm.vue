<template>
  <div class="add">
    <div class="container">
    <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Batches'}">Back</router-link>
    <router-link v-else class="btn btn-default" :to="{name: 'BatchDetails',params: {'id':id}}">Back</router-link>

    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <h1 class="page-header">{{mode}} Batch</h1>
    <br>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postBatch">

      <div class="form-group">

        <label class="col-sm-2 control-label ">
          Timing
        </label>

        <div class="col-sm-10">
          <select class="form-control" name="timing" v-model="batch.timing">
                  <option value="9AM-11AM">9AM-11AM</option>
                  <option value="10AM-12PM">10AM-12PM</option>
                  <option value="11AM-1PM">11AM-1PM</option>
                  <option value="12PM-2PM">12PM-2PM</option>
                  <option value="1PM-3PM">1PM-3PM</option>
                  <option value="2PM-4PM">2PM-4PM</option>
                  <option value="3PM-5PM">3PM-5PM</option>
                  <option value="4PM-6PM">4PM-6PM</option>
                  <option value="5PM-7PM">5PM-7PM</option>
          </select>
        </div>
      </div>

      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Day
          </label>


          <div class="col-sm-10">
            <select class="form-control" name="day" v-model="batch.day">
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
            </select>
          </div>
      </div>





      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Level
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="level" v-model="batch.level">

              <option value="" selected="">--------</option>
                  <option value="1">Level-1</option>
                  <option value="2">Level-2</option>
                  <option value="3">Level-3</option>
                  <option value="4">Level-4</option>
                  <option value="5">Level-5</option>
                  <option value="6">Level-6</option>
                  <option value="7">Level-7</option>
                  <option value="8">Level-8</option>
                  <option value="9">Level-9</option>
                  <option value="10">Level-10</option>
                  <option value="11">Module-1</option>
                  <option value="12">Module-2</option>
                  <option value="13">Module-3</option>
                  <option value="14">Module-4</option>
          </select>
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Level start date
        </label>


        <div class="col-sm-10">
          <input name="level_start_date" v-model="batch.level_start_date" class="form-control" type="date" value="">
        </div>
      </div>


      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Running Months
          </label>

        <div class="col-sm-10">
          <multiselect
            v-model="selected_months"
            :options="months"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :hide-selected="true"
            :preserve-search="true"
            :max="3"
            placeholder="Pick three months"
            label="month"
            track-by="month">
          </multiselect>
        </div>

      </div>



      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Teacher
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="teacher" v-model="batch.teacher">

              <option value="" selected="">--------</option>
              <option v-for="teacher in teachers" v-bind:value="teacher.id">{{teacher.name}}</option>

          </select>
        </div>

      </div>

      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Centre
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="teacher" v-model="batch.centre">

              <option value="" selected="">--------</option>
              <option v-for="centre in centres" v-bind:value="centre.id">{{centre.name}}</option>

          </select>
        </div>

      </div>

      <div class="form-actions">
        <button class="btn btn-primary" title="Make a POST request on the Batch List resource">POST</button>
      </div>

  </form>
  </div>
</div>
</template>

<script>
  import {restAPI} from '@/services/rest-api';
  import Alert from '@/components/Alert';
  import Multiselect from 'vue-multiselect';

  export default {
    name: 'add',
    props: {
      mode: String
    },
    data () {
        return {
          batch: {},
          teachers: [],
          centres: [],
          selected_months: [],
          months: [
            { id: 1, month: "January"},
            { id: 2, month: "February"},
            { id: 3, month: "March"},
            { id: 4, month: "April"},
            { id: 5, month: "May"},
            { id: 6, month: "June"},
            { id: 7, month: "July"},
            { id: 8, month: "August"},
            { id: 9, month: "September"},
            { id: 10, month: "October"},
            { id: 11, month: "November"},
            { id: 12, month: "December"},
          ],
          month_dict: {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
          },
          alert:{
            message: '',
            type: '',
            raised: false
          },
        }
    },
    methods: {
      postBatch(e){
          if(!this.batch.timing || !this.batch.day ||
             !this.batch.level_start_date || !this.batch.centre ||
             !this.batch.level || !this.batch.teacher){
              this.raiseAlert('Please fill in all required fields.','danger');
          } else {
              var month_ids = this.extractMonthIds(this.selected_months);
              this.batch['running_months'] = month_ids;
              if (this.mode === 'Add') {
                restAPI.post('batch/', this.batch)
                    .then(response => {
                        this.$router.push({name: 'Batches', query: {alert: 'New batch added succesfully'}});
                    });

              } else if (this.mode === 'Edit'){
                restAPI.put('batch/' + this.$route.params.id + '/', this.batch)
                    .then(response => {
                        this.$router.push({name: 'BatchDetails', params:{id:this.id}, query: {alert: 'Batch details edited succesfully'}});
                    });
              }

              e.preventDefault();
          }
          e.preventDefault();
      },

      fetchBatch(id){
          restAPI.get('batch/'+id)
          .then(response => {
            this.batch = response.data;
            this.selected_months = this.generateMonths(this.batch.running_months);
          });
      },

      fetchTeachers(){
        restAPI.get('teacher/')
          .then(response => {
            this.teachers = response.data;
          });
      },
      fetchCentres(){
        restAPI.get('centre/')
          .then(response => {
            this.centres = response.data;
          });
      },
      extractMonthIds(months){
        var output = [];
        for (var i=0; i < months.length ; ++i)
          output.push(months[i].id);
        return output;
      },
      generateMonths(monthids){
        console.log("Here!")
        console.log(monthids)
        var output = [];
        for (var i=0; i < monthids.length ; ++i)
          output.push({id: monthids[i],month: this.month_dict[monthids[i]]});
        return output;
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
      this.fetchTeachers()
      this.fetchCentres()
      if (this.mode === 'Edit'){
        this.fetchBatch(this.$route.params.id);
      }
    },
    computed: {
      id: function(){
        return parseInt(this.$route.params.id)
      }
    },
    components: {
        Alert,
        Multiselect
    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
