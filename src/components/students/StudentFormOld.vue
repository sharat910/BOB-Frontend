<template>
  <div class="add">
    <div class="container">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Students'}">Back</router-link>
    <router-link v-else class="btn btn-default" :to="{name: 'StudentDetails',params: {'id': id}}">Back</router-link>


    <h1 class="page-header">{{mode}} Student</h1>
    <br>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postStudent">

      <div class="form-group ">

        <label class="col-sm-2 control-label "> Name </label>

        <div class="col-sm-10">
          <input name="name" v-model="student.name" class="form-control" type="text" value="">
        </div>

      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Date of birth
        </label>

        <div class="col-sm-2">
          <input name="date_of_birth" v-model="student.date_of_birth" class="form-control" type="date" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Date of joining
        </label>

        <div class="col-sm-2">
          <input name="date_of_joining" v-model="student.date_of_joining" class="form-control" type="date" value="">
        </div>

      </div>

      <div class="form-group">

        <label class="col-sm-2 control-label ">
          Batch
        </label>

        <div class="col-sm-10">
          <select class="form-control" name="batch" v-model="student.batch">
              <option value="" selected="">--------</option>
                  <option v-for="batch in batches" v-bind:value="batch.id">{{batch.summary}}</option>
          </select>
        </div>

      </div>

    <div class="form-group">
        <label class="col-sm-2 control-label ">
          T shirt size
        </label>


        <div class="col-sm-10">
          <select class="form-control" name="t_shirt_size" v-model="student.t_shirt_size">
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
              <option value="5XL">5XL</option>
          </select>
        </div>
    </div>

    <div class="form-group ">

      <label class="col-sm-2 control-label ">
        Father name
      </label>

      <div class="col-sm-10">
        <input name="father_name" v-model="student.father_name" class="form-control" type="text" value="">
      </div>

    </div>

    <div class="form-group ">

      <label class="col-sm-2 control-label ">
        Mother name
      </label>

      <div class="col-sm-10">
        <input name="mother_name" v-model="student.mother_name" class="form-control" type="text" value="">
      </div>

    </div>

    <div class="form-group ">

      <label class="col-sm-2 control-label ">
        Phone
      </label>

      <div class="col-sm-10">
        <input name="phone" v-model="student.phone" class="form-control" type="text" value="">
      </div>

    </div>

    <div class="form-group ">

      <label class="col-sm-2 control-label ">
        Alternate Phone
      </label>

      <div class="col-sm-10">
        <input name="alt_phone" v-model="student.alt_phone" class="form-control" type="text" value="">
      </div>

    </div>

    <div class="form-group ">

      <label class="col-sm-2 control-label ">
        Email
      </label>

      <div class="col-sm-10">
        <input name="email" v-model="student.email" class="form-control" type="email" value="">
      </div>

    </div>

    <div class="form-group ">

      <label class="col-sm-2 control-label ">
        Photo
      </label>


      <div class="col-sm-10">
        <input name="photo" type="file" value="">
      </div>
    </div>

      <div class="form-group">

        <label class="col-sm-2 control-label ">
          Performance rating
        </label>


        <div class="col-sm-10">
          <select class="form-control" name="performance_rating">

                  <option value="High">High</option>

                  <option value="Medium" selected>Medium</option>

                  <option value="Low">Low</option>

          </select>
        </div>

      </div>

    <div class="form-group horizontal-checkbox ">

      <label class="col-sm-2 control-label ">
        Dropped
      </label>

      <div class="col-sm-10">
        <input name="dropped" v-model="student.dropped" type="checkbox" value="true">
      </div>

    </div>

    <div class="form-group ">
      <label class="col-sm-2 control-label ">
        Date dropped
      </label>


      <div class="col-sm-10">
        <input name="date_dropped" v-model="student.date_dropped" class="form-control" type="date" value="">
      </div>
    </div>

      <div class="form-group">
        <button class="btn btn-primary" title="Save student details">Submit</button>
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
        student: {},
        batches: [],
        alert:{
          message: '',
          type: '',
          raised: false
        },
        }
    },
    methods: {
        postStudent(e){
            if(!this.student.name || !this.student.date_of_birth || !this.student.email){
                this.raiseAlert('Please fill in all required fields','danger');
            } else {

                if (this.mode === 'Add') {
                  this.$http.post('http://localhost:8000/api/student/', this.student)
                      .then(function(response){
                          this.$router.push({name: 'Students', query: {alert: 'Student added succesfully.'}});
                      });

                } else if (this.mode === 'Edit'){
                  this.$http.put('http://localhost:8000/api/student/' + this.$route.params.id + '/', this.student)
                      .then(function(response){
                          this.$router.push({name: 'StudentDetails', params:{id:this.id}, query: {alert: 'Student details edited succesfully.'}});
                      });
                }

                e.preventDefault();
            }
            e.preventDefault();
        },
        fetchBatches(){
          this.$http.get('http://localhost:8000/api/batch/')
          .then(function(response){
            this.batches = response.data;
          });
        },
        fetchStudent(id){
            this.$http.get('http://127.0.0.1:8000/api/student/'+id)
            .then(function(response){
              this.student = response.data;
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
        this.fetchBatches();
        if (this.mode === 'Edit'){
          this.fetchStudent(this.$route.params.id);
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
