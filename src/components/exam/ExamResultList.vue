<template lang="html">
  <div class="examresults container">
    <Alert v-if="alert" v-bind:message="alert" />
    <h2 class="page-header"> Exam Results
      <span class="pull-right">
        <button type="button" v-if="!viewtable" @click="viewtable=true;"class="btn btn-default">View Results</button>
        <button type="button" v-if="viewtable" @click="viewtable=false;"class="btn btn-default">Hide Results</button>
        <button type="button" @click="launch_form=true,mode='Add'" class="btn btn-success"
        data-toggle="modal" data-target="#examModal"
        data-backdrop="static" data-keyboard="false">Add Result</button>
      </span>
    </h2>

  <table v-if="viewtable" class="table table-striped">
      <thead>
        <tr>
          <th>Score</th>
          <th>Date of Exam</th>
          <th>Level</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="exam in examresults">
          <td>{{exam.score}} / {{exam.max_score}}</td>
          <td>{{exam.date_of_exam}}</td>
          <td>{{exam.level}}</td>
          <td>
          <button @click="launch_form=true;mode='Edit';exam_id=exam.id" class="btn btn-default"
            data-toggle="modal" data-target="#examModal" data-backdrop="static" data-keyboard="false">
            Edit
          </button>
             <button class="btn btn-danger" @click="deleteExamResult(exam.id);$emit('examUpdated')">Delete</button>
          </td>
        </tr>
      </tbody>
  </table>
  <div id="examModal" class="modal fade">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" @click="launch_form=false" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{{this.mode}} Exam Result</h4>
        </div>
        <div class="modal-body">
          <ExamForm v-if="launch_form"
          :student_id="this.student_id"
          :mode="this.mode"
          :exam_id="this.exam_id"
          v-on:examUpdated="$emit('examUpdated')"
          />
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>

import ExamForm from '@/components/exam/ExamForm';
import Alert from '@/components/Alert';

export default {
  name: 'examresultlist',
  props: {
    examresults: Array,
    student_id: Number
  },
  data() {
      return {
        mode: '',
        alert: '',
        exam_id: 0,
        launch_form: false,
        viewtable: false
      }
  },
  methods: {
    deleteExamResult(id){
        this.$http.delete('http://127.0.0.1:8000/api/examresult/'+id + '/')
        .then(function(response){
          this.alert = 'Exam Result Deleted';
        });
    },
  },
  components: {
    ExamForm,
    Alert
  }
}
</script>

<style lang="css">
</style>
