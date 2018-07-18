<template>
    <div class="examform">
    <!-- <TopBar entity='Exam'/> -->
    <!-- <div class="container"> -->
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postExam">


      <div class="form-group">
          <label class="col-sm-2 control-label ">
            Exam Score
          </label>

          <div class="col-sm-10">
            <div class="form-inline">
              <input name="score" class="form-control" type="number" v-model="exam.score">
               &nbsp; / &nbsp;
              <input name="max_score" class="form-control" type="number" v-model="exam.max_score">
            </div>
          </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Exam Date
        </label>


        <div class="col-sm-10">
          <input name="date_of_exam" class="form-control" type="date" v-model="exam.date_of_exam" value="">
        </div>
      </div>

      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Level
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="level" v-model="exam.level">

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


        <div class="form-actions">
          <button class="btn btn-primary" :title="mode + 'Exam Result'">Save</button>
        </div>


    </form>

  </div>
<!-- </div> -->
</template>

<script>
    import Alert from '@/components/Alert';
    import {restAPI} from '@/services/rest-api';

    export default {
    name: 'examform',
    props: {
      mode: String,
      student_id: Number,
      exam_id: Number
    },
    data () {
        return {
        exam: {},
        alert:{
          message: '',
          type: '',
          raised: false
        },
        }
    },
    methods: {
        postExam(e){
            if(!this.exam.score || !this.exam.max_score ||
                !this.exam.date_of_exam || !this.exam.level){
                this.raiseAlert('Please fill in all the fields','danger');
            } else {
                var new_exam = {
                score: this.exam.score,
                max_score: this.exam.max_score,
                date_of_exam: this.exam.date_of_exam,
                student: this.student_id,
                level: this.exam.level
              };
              if (this.mode === 'Add') {

                  restAPI.post('examresult/', new_exam)
                      .then(response => {
                          this.raiseAlert('Exam Result added succesfully.','success');
                          this.$emit('examUpdated');
                          // this.$router.push({name: 'StudentDetails', params: {id: this.student_id},query: {alert: 'Exam Added'}});
                      }).catch(e => {
                        console.error(e);console.error(e.response)
                      });

                } else if (this.mode === 'Edit'){
                  restAPI.put('examresult/' + this.exam_id + '/', new_exam)
                      .then(response => {
                          this.raiseAlert('Exam Result edited succesfully.','success');
                          this.$emit('examUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response)
                      });
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchExam(id){
            console.log("In fetch exam")
            restAPI.get('examresult/'+id + '/')
            .then(response => {
              this.exam = response.data;
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
        console.log("Created")
        if (this.mode === 'Edit'){
          this.fetchExam(this.exam_id);
        }
    },

    components: {
        Alert
    },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
