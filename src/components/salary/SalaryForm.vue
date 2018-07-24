<template>
    <div class="salaryform">
    <!-- <div class="container"> -->
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postSalary">

      <div class="form-group">

        <label class="col-sm-2 control-label ">
          Batch
        </label>

        <div class="col-sm-10">
          <select class="form-control" name="batch" v-model="salary_batch">
              <option value="" selected="">--------</option>
                  <option v-for="batch in batches" v-bind:value="batch.id">{{batch.summary}}</option>
          </select>
        </div>

      </div>

      <div class="form-group">
          <label class="col-sm-2 control-label ">
            Salary type
          </label>

        <div class="col-sm-10">
          <select class="form-control" name="salary_type" v-model="salary_type">
              <option value="Level">Level</option>
              <option value="Month">Month</option>
          </select>
        </div>
      </div>

      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Level
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="level" v-model="salary.level">

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
          Salary amount
        </label>


        <div class="col-sm-10">
          <input name="salary_amount" class="form-control" type="number" v-model="salary.salary_amount" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Balance
        </label>


        <div class="col-sm-10">
          <input name="fee_amount" class="form-control" type="number" v-model="salary.balance" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Due
        </label>


        <div class="col-sm-10">
          <input name="salary_amount" class="form-control" type="number" v-model="salary.due" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Payment Date
        </label>


        <div class="col-sm-10">
          <input name="date_of_payment" class="form-control" type="date" v-model="salary.date_of_payment" value="">
        </div>
      </div>


      <div v-if="multiple_months" class="form-group">

          <label class="col-sm-2 control-label ">
            Months paid for
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

      <div v-if="!multiple_months" class="form-group">

          <label class="col-sm-2 control-label ">
            Month paid for
          </label>

        <div class="col-sm-10">
          <multiselect
            v-model="selected_month"
            :options="months"
            :multiple="false"
            :close-on-select="true"
            :clear-on-select="false"
            :hide-selected="true"
            :preserve-search="true"
            placeholder="Pick one month"
            label="month"
            track-by="month">
          </multiselect>
        </div>

      </div>
        <div class="form-actions">
          <button class="btn btn-primary" title="Make a POST request on the Salary Record List resource">POST</button>
        </div>


    </form>

  </div>
<!-- </div> -->
</template>

<script>

    import Multiselect from 'vue-multiselect';
    // Vue.component('multiselect', Multiselect)
    import {restAPI} from '@/services/rest-api';
    import Alert from '@/components/Alert';
    export default {
    name: 'salaryform',
    props: {
      mode: String,
      teacher_id: Number,
      batches: Array,
      salary_id: Number
    },
    data () {
        return {
        salary: {
          balance: 0,
          due: 0
        },
        alert:{
          message: '',
          type: '',
          raised: false
        },
        salary_type: '',
        salary_batch: -1,
        salary_rate: -1,
        num_of_students: -1,

        multiple_months: false,
        selected_month: {},
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
        }
        }
    },
    methods: {
        postSalary(e){
            if(!this.salary_type || this.selected_months.length == 0 ||
                !this.salary.salary_amount || !this.salary.date_of_payment || !this.salary.level){
                this.raiseAlert('Please fill in all the fields','danger');
            } else {
            var month_ids = [];
            if (this.multiple_months == true)
              month_ids = this.extractMonthIds(this.selected_months);
            else{
              month_ids.push(this.selected_month.id);
            }


              var new_salary = {
                salary_type: this.salary_type,
                batch: this.salary_batch,
                salary_amount: this.salary.salary_amount,
                date_of_payment: this.salary.date_of_payment,
                teacher: this.teacher_id,
                level: this.salary.level,
                due: this.salary.due,
                balance: this.salary.balance,
                months: month_ids
              };
              if (this.mode === 'Add') {

                  restAPI.post('salaryrecord/', new_salary)
                      .then(response => {
                          this.raiseAlert('Salary Record added succesfully','success');
                          this.$emit('salaryUpdated');
                          // this.$router.push({name: 'StudentDetails', params: {id: this.teacher_id},query: {alert: 'Salary Added'}});
                      }).catch(e => {
                        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
                      })

                } else if (this.mode === 'Edit'){
                  restAPI.put('salaryrecord/' + this.salary_id + '/', new_salary)
                      .then(response => {
                          this.raiseAlert('Salary Record edited succesfully','success');
                          this.$emit('salaryUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
                      })
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchSalary(id){
            console.log("In fetch salary")
            restAPI.get('salaryrecord/'+id + '/')
            .then(response => {
              this.salary = response.data;
              this.salary_type = this.salary.salary_type;
              this.salary_batch = this.salary.batch;
              if (this.salary_type==="Level")
                this.selected_months = this.generateMonths(this.salary.months);
              else
                this.selected_month = this.generateMonths(this.salary.months)[0];
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
            })
        },

        fetchSalaryRate(){
          restAPI.get('salaryrate/1/')
          .then(response => {
            this.salary_rate = response.data['salary_rate'];
          }).catch(e => {
            console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.',danger)
          })
        },

        extractMonthIds(months){
          // console.log("in func");
          // console.log(months);
          var output = [];
          for (var i=0; i < months.length ; ++i){
            // console.log(months[i]);
            output.push(months[i].id);
          }

          return output;
        },
        generateMonths(monthids){

          if (monthids.length == 1)
            return {id: monthids[0],month: this.month_dict[monthids[0]]}
          var output = [];
          for (var i=0; i < monthids.length ; ++i){

            output.push({id: monthids[i],month: this.month_dict[monthids[i]]})
          }
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
        console.log("Created")
        this.fetchSalaryRate()
        if (this.mode === 'Edit'){
          this.fetchSalary(this.salary_id);
        }
    },
    // updated: function(){
    //     if (this.mode === 'Edit'){
    //       this.fetchSalary(this.salary_id);
    //     }
    // },
    watch:{
      salary_batch: function(val){
        var batch = this.batches.find(x => x.id == val);
        this.num_of_students = batch.students.length;
      },
      salary_type: function(val){
        if (this.num_of_students == -1){
          this.raiseAlert('Please select the batch first.','danger');
        }
        if (val === 'Level') {
            this.salary.salary_amount = this.salary_rate*3*this.num_of_students;
            this.multiple_months = true;
        } else if (val == 'Month' ) {
            this.salary.salary_amount = this.salary_rate*this.num_of_students;
            this.multiple_months = false;
        } else {
          console.log("No type set");
        }
      },
      // mode: function(val){
      //   if (val === 'Edit'){
      //     this.fetchSalary(this.salary_id);
      //   }
      // }
    },
    components: {
        Alert,
        Multiselect
    },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
