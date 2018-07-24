<template>
    <div class="feeform">
    <!-- <div class="container"> -->
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postFee">


      <div class="form-group">
          <label class="col-sm-2 control-label ">
            Fee type
          </label>

        <div class="col-sm-10">
          <select class="form-control" name="fee_type" v-model="fee_type">
              <option value="Level">Level</option>
              <option value="Month">Month</option>
              <option value="Exam">Exam</option>
              <option value="Registration">Registration</option>
          </select>
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Fee amount
        </label>


        <div class="col-sm-10">
          <input name="fee_amount" class="form-control" type="number" v-model="fee.fee_amount" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Balance
        </label>


        <div class="col-sm-10">
          <input name="fee_amount" class="form-control" type="number" v-model="fee.balance" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Due
        </label>


        <div class="col-sm-10">
          <input name="fee_amount" class="form-control" type="number" v-model="fee.due" value="">
        </div>
      </div>


      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Fee receipt no
        </label>


        <div class="col-sm-10">
          <input name="fee_receipt_no" class="form-control" type="number" v-model="fee.fee_receipt_no" value="">
        </div>
      </div>

      <div class="form-group">

          <label class="col-sm-2 control-label ">
            Level
          </label>


        <div class="col-sm-10">
          <select class="form-control" name="level" v-model="fee.level">

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
          Payment Date
        </label>


        <div class="col-sm-10">
          <input name="date_of_payment" class="form-control" type="date" v-model="fee.date_of_payment" value="">
        </div>
      </div>


      <div v-if="multiple_months" class="form-group">

          <label class="col-sm-2 control-label ">
            Months
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
            Month
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

      <div v-if="fee_type==='Level'"class="form-actions">
        <label class="col-sm-2 control-label ">
          Append Exam Fee
        </label>

        <div class="col-sm-10">
          <input type="checkbox" id="checkbox" v-model="add_exam_fee">
        </div>
      </div>

        <div class="form-actions">
          <button class="btn btn-primary" title="Make a POST request on the Fee Record List resource">POST</button>
        </div>




    </form>

  </div>
<!-- </div> -->
</template>

<script>

    import Multiselect from 'vue-multiselect';
    // Vue.component('multiselect', Multiselect)
    import Alert from '@/components/Alert';
    import {restAPI} from '@/services/rest-api';

    export default {
    name: 'feeform',
    props: {
      mode: String,
      student_id: Number,
      fee_id: Number,
    },
    data () {
        return {
        fee: {
          balance: 0,
          due: 0
        },

        add_exam_fee: false,

        alert:{
          message: '',
          type: '',
          raised: false
        },

        fee_type: '',
        feerates: {},

        selected_months: [],
        selected_month: {},
        multiple_months: false,

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
        postFee(e){
            if(!this.fee_type ||
                !this.fee.fee_amount || !this.fee.fee_receipt_no ||
                !this.fee.level || !this.fee.date_of_payment){
                this.raiseAlert('Please fill in all the fields','danger');
            } else {
            var month_ids = [];
            if (this.multiple_months == true)
              month_ids = this.extractMonthIds(this.selected_months);
            else{
              month_ids.push(this.selected_month.id);
            }


              var new_fee = {
                fee_type: this.fee_type,
                fee_amount: this.fee.fee_amount,
                balance: this.fee.balance,
                due: this.fee.due,
                fee_receipt_no: this.fee.fee_receipt_no,
                student: this.student_id,
                level: this.fee.level,
                date_of_payment: this.fee.date_of_payment,
                months: month_ids
              };
              if (this.mode === 'Add') {

                  restAPI.post('feerecord/', new_fee)
                      .then(response => {
                          this.raiseAlert('Fee Record added succesfully','success');
                          this.$emit('feeUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                      })
                  e.preventDefault();
                  if (this.add_exam_fee) {
                    var exam_month_ids = [];
                    exam_month_ids.push(month_ids.slice(-1).pop());
                    var new_exam_fee = {
                      fee_type: "Exam",
                      fee_amount: this.feerates.exam_fee,
                      balance: 0,
                      due: 0,
                      fee_receipt_no: this.fee.fee_receipt_no,
                      student: this.student_id,
                      level: this.fee.level,
                      date_of_payment: this.fee.date_of_payment,
                      months: exam_month_ids
                    };
                    restAPI.post('feerecord/', new_exam_fee)
                        .then(response => {
                            this.raiseAlert('Exam Fee Record added succesfully','success');
                            this.$emit('feeUpdated');
                            // this.$router.push({name: 'StudentDetails', params: {id: this.student_id},query: {alert: 'Fee Added'}});
                        }).catch(e => {
                          console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                        })
                    e.preventDefault();
                  }

                } else if (this.mode === 'Edit'){
                  restAPI.put('feerecord/' + this.fee_id + '/', new_fee)
                      .then(response => {
                          this.raiseAlert('Fee Record edited succesfully','success');
                          this.$emit('feeUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                      })
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchFee(id){
            console.log("In fetch fee")
            restAPI.get('feerecord/'+id + '/')
            .then(response => {
              this.fee = response.data;
              this.fee_type = this.fee.fee_type;
              if (this.fee_type==="Level")
                this.selected_months = this.generateMonths(this.fee.months);
              else
                this.selected_month = this.generateMonths(this.fee.months)[0];
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
            })
        },
        fetchFeeRates(id){
            console.log("In fetch fee")
            restAPI.get('feerate/1/')
            .then(response => {
              this.feerates = response.data;
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
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
        this.fetchFeeRates();
        if (this.mode === 'Edit'){
          this.fetchFee(this.fee_id);
        }
    },
    // updated: function(){
    //     if (this.mode === 'Edit'){
    //       this.fetchFee(this.fee_id);
    //     }
    // },
    watch:{
      fee_type: function(val){

        if (val === 'Level') {
            this.fee.fee_amount = this.feerates.level_fee;
            this.multiple_months = true;
        } else if (val == 'Month' ) {
            this.fee.fee_amount = this.feerates.month_fee;
            this.multiple_months = false;
        } else if (val == 'Exam') {
            this.fee.fee_amount = this.feerates.exam_fee;
            this.multiple_months = false;
        } else if (val == 'Registration') {
            this.fee.fee_amount = this.feerates.registration_fee;
            this.multiple_months = false;
        }else {
          console.log("No type set");
        }
      },
      // mode: function(val){
      //   if (val === 'Edit'){
      //     this.fetchFee(this.fee_id);
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
