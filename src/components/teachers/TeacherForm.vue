<template>
  <div class="add">
    <div class="container">
      <router-link v-if="mode==='Add'" class="btn btn-default" :to="{name: 'Teachers'}">Back</router-link>
      <router-link v-else class="btn btn-default" :to="{name: 'TeacherDetails',params: {'id':id}}">Back</router-link>

    <Alert v-if="alert" v-bind:message="alert" />
    <h1 class="page-header">{{mode}} Teacher</h1>
    <br>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postTeacher">

      <div class="form-group ">

        <label class="col-sm-2 control-label "> Name </label>

        <div class="col-sm-10">
          <input name="name" v-model="teacher.name" class="form-control" type="text" value="">
        </div>

      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Phone
        </label>

        <div class="col-sm-10">
          <input name="phone" v-model="teacher.phone" class="form-control" type="text" value="">
        </div>

      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Email
        </label>

        <div class="col-sm-10">
          <input name="email" v-model="teacher.email" class="form-control" type="email" value="">
        </div>

      </div>

      <div class="form-group">

        <label class="col-sm-2 control-label ">
          Trained max level
        </label>

        <div class="col-sm-10">
          <select class="form-control" name="trained_max_level" v-model="teacher.trained_max_level">

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
        <button class="btn btn-primary" title="Save teacher details">Submit</button>
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
        teacher: {},
        alert:''
        }
    },
    methods: {
        postTeacher(e){
            if(!this.teacher.name || !this.teacher.phone ){
                this.alert = 'Please fill in all required fields: Name, Phone';
            } else {

                if (this.mode === 'Add') {
                  this.$http.post('http://localhost:8000/api/teacher/', this.teacher)
                      .then(function(response){
                          this.$router.push({name: 'Teachers', query: {alert: 'Teacher Added'}});
                      });

                } else if (this.mode === 'Edit'){
                  this.$http.put('http://localhost:8000/api/teacher/' + this.$route.params.id + '/', this.teacher)
                      .then(function(response){
                          this.$router.push({name: 'Teachers', query: {alert: 'Teacher Details Edited'}});
                      });
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchTeacher(id){
            this.$http.get('http://127.0.0.1:8000/api/teacher/'+id)
            .then(function(response){
              this.teacher = response.body;
            });
        },
    },
    created: function(){
        if (this.mode === 'Edit'){
          this.fetchTeacher(this.$route.params.id);
        }
    },
    computed: {
      id: function(){
        return this.$route.params.id
      }
    },
    components: {
      Alert
    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
