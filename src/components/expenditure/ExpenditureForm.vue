<template>
    <div class="expenditureform">
    <!-- <TopBar entity='Expenditure'/> -->
    <!-- <div class="container"> -->
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <form  enctype="multipart/form-data" class="form-horizontal" v-on:submit="postExpenditure">

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Voucher ID
        </label>


        <div class="col-sm-10">
          <input name="voucher_id" class="form-control" type="number" v-model="expenditure.voucher_id" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Description
        </label>


        <div class="col-sm-10">
          <input name="description" class="form-control" type="text" v-model="expenditure.description" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Date
        </label>


        <div class="col-sm-10">
          <input name="date" class="form-control" type="date" v-model="expenditure.date" value="">
        </div>
      </div>

      <div class="form-group ">

        <label class="col-sm-2 control-label ">
          Amount
        </label>


        <div class="col-sm-10">
          <input name="salary_amount" class="form-control" type="number" v-model="expenditure.amount" value="">
        </div>
      </div>

        <div class="form-actions">
          <button class="btn btn-primary" title="Save details">Save</button>
        </div>


    </form>

  </div>
<!-- </div> -->
</template>

<script>
    import Alert from '@/components/Alert';

    export default {
    name: 'expenditureform',
    props: {
      mode: String,
      expenditure_id: Number
    },
    data () {
        return {
        expenditure: {},
        alert:{
          message: '',
          type: '',
          raised: false
        },
      }
    },
    methods: {
        postExpenditure(e){
            if(!this.expenditure.date || !this.expenditure.voucher_id ||
                !this.expenditure.description || !this.expenditure.amount){
                this.raiseAlert('Please fill in all the fields','danger');
            } else {

              if (this.mode === 'Add') {

                  this.$http.post('http://localhost:8000/api/expenditure/', this.expenditure)
                      .then(function(response){
                          this.raiseAlert('Expenditure Record added succesfully','success');
                          this.$emit('expenditureUpdated');
                          // this.$router.push({name: 'StudentDetails', params: {id: this.teacher_id},query: {alert: 'Expenditure Added'}});
                      });

                } else if (this.mode === 'Edit'){
                  this.$http.put('http://localhost:8000/api/expenditure/' + this.expenditure_id + '/', this.expenditure)
                      .then(function(response){
                          this.raiseAlert('Expenditure Record edited succesfully','success');
                          this.$emit('expenditureUpdated');
                      });
                }

                e.preventDefault();
            }
            e.preventDefault();
        },

        fetchExpenditure(id){
            this.$http.get('http://127.0.0.1:8000/api/expenditure/'+id + '/')
            .then(function(response){
              this.expenditure = response.body;
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
        if (this.mode === 'Edit'){
          this.fetchExpenditure(this.expenditure_id);
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
