<template>
  <div class="add">
    <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>

    <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Batches'}">Back</router-link>
    <router-link v-else class="btn btn-default" :to="{name: 'BatchDetails',params: {'id':id}}">Back</router-link>


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

    <div class="form-actions">
      <button class="btn btn-primary" title="Make a POST request on the Batch List resource">POST</button>
    </div>

  </form>
  </div>
</div>
</template>

<script>
  import Alert from '@/components/Alert';

  export default {
    name: 'add',
    props: {
      mode: String
    },
    data () {
        return {
        batch: {},
        teachers: [],
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
               !this.batch.level_start_date ||
               !this.batch.level || !this.batch.teacher){
                this.raiseAlert('Please fill in all required fields.','danger');
            } else {

                if (this.mode === 'Add') {
                  this.$http.post('http://localhost:8000/api/batch/', this.batch)
                      .then(function(response){
                          this.$router.push({name: 'Batches', query: {alert: 'New batch added succesfully'}});
                      });

                } else if (this.mode === 'Edit'){
                  this.$http.put('http://localhost:8000/api/batch/' + this.$route.params.id + '/', this.batch)
                      .then(function(response){
                          this.$router.push({name: 'BatchDetails', params:{id:this.id}, query: {alert: 'Batch details edited succesfully'}});
                      });
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchBatch(id){
            this.$http.get('http://127.0.0.1:8000/api/batch/'+id)
            .then(function(response){
              this.batch = response.data;
            });
        },

        fetchTeachers(){
          this.$http.get('http://127.0.0.1:8000/api/teacher/')
            .then(function(response){
              this.teachers = response.data;
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
      this.fetchTeachers()
        if (this.mode === 'Edit'){
          this.fetchBatch(this.$route.params.id);
        }
    },
    computed: {
      id: function(){
        return this.$route.params.id
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
