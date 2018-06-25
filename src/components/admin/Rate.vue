<template lang="html">
  <div class="ratemanager">
    <div class="container">
      <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
      <h1 class="page-header"> Rate Manager </h1>

      <div class="col-sm-4">
        <h3 class="page-header"> Fee</h3>
        <br>
        <div class="form-horizontal">
            <div class="well">
            <div class="form-group">
              <label class="col-sm-4 control-label"> Month Fee </label>
              <div class="col-sm-8">
                <li v-if="!attr.feerate.edit" class="list-group-item"> {{rates.feerate.month_fee}} </li>
                <input class="form-control" v-if="attr.feerate.edit" v-model="rates.feerate.month_fee" type="number" name="" value="">
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label"> Level Fee </label>
              <div class="col-sm-8">
                <li v-if="!attr.feerate.edit" class="list-group-item"> {{rates.feerate.level_fee}} </li>
                <input class="form-control" v-if="attr.feerate.edit" v-model="rates.feerate.level_fee" type="number" name="" value="">
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label"> Exam Fee </label>
              <div class="col-sm-8">
                <li v-if="!attr.feerate.edit" class="list-group-item"> {{rates.feerate.exam_fee}} </li>
                <input class="form-control" v-if="attr.feerate.edit" v-model="rates.feerate.exam_fee" type="number" name="" value="">
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label"> Registration Fee </label>
              <div class="col-sm-8">
                <li v-if="!attr.feerate.edit" class="list-group-item"> {{rates.feerate.registration_fee}} </li>
                <input class="form-control" v-if="attr.feerate.edit" v-model="rates.feerate.registration_fee" type="number" name="" value="">
              </div>
            </div>

              <button v-if="!attr.feerate.edit" @click="edit('feerate');" class="btn btn-info">
                Edit
              </button>
              <button v-if="attr.feerate.edit" @click="save('feerate');" class="btn btn-primary">
                Save
              </button>

          </div>
        </div>
      </div>

      <div class="col-sm-4">
        <h3 class="page-header"> Royalty</h3>
        <br>
        <div class="form-horizontal">
            <div class="well">
            <div class="form-group">
              <label class="col-sm-4 control-label"> Month Royalty </label>
              <div class="col-sm-8">
                <li v-if="!attr.royaltyrate.edit" class="list-group-item"> {{rates.royaltyrate.month_royalty}} </li>
                <input class="form-control" v-if="attr.royaltyrate.edit" v-model="rates.royaltyrate.month_royalty" type="number" name="" value="">
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label"> Level Royalty </label>
              <div class="col-sm-8">
                <li v-if="!attr.royaltyrate.edit" class="list-group-item"> {{rates.royaltyrate.level_royalty}} </li>
                <input class="form-control" v-if="attr.royaltyrate.edit" v-model="rates.royaltyrate.level_royalty" type="number" name="" value="">
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label"> Exam Royalty </label>
              <div class="col-sm-8">
                <li v-if="!attr.royaltyrate.edit" class="list-group-item"> {{rates.royaltyrate.exam_royalty}} </li>
                <input class="form-control" v-if="attr.royaltyrate.edit" v-model="rates.royaltyrate.exam_royalty" type="number" name="" value="">
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label"> Registration Royalty </label>
              <div class="col-sm-8">
                <li v-if="!attr.royaltyrate.edit" class="list-group-item"> {{rates.royaltyrate.registration_royalty}} </li>
                <input class="form-control" v-if="attr.royaltyrate.edit" v-model="rates.royaltyrate.registration_royalty" type="number" name="" value="">
              </div>
            </div>

              <button v-if="!attr.royaltyrate.edit" @click="edit('royaltyrate');" class="btn btn-info">
                Edit
              </button>
              <button v-if="attr.royaltyrate.edit" @click="save('royaltyrate');" class="btn btn-primary">
                Save
              </button>

          </div>
        </div>
      </div>

      <div class="col-sm-4">
        <h3 class="page-header">Salary</h3>
        <br>
        <div class="form-horizontal">
            <div class="well">
            <div class="form-group">
              <label class="col-sm-6 control-label"> Salary (per month per student) </label>
              <div class="col-sm-6">
                <li v-if="!attr.salaryrate.edit" class="list-group-item"> {{rates.salaryrate.salary_rate}} </li>
                <input v-if="attr.salaryrate.edit" name="salary_rate" class="form-control" type="number" v-model="rates.salaryrate.salary_rate" value="">
              </div>
            </div>
            <button v-if="!attr.salaryrate.edit" @click="edit('salaryrate');" class="btn btn-info">
              Edit
            </button>
            <button v-if="attr.salaryrate.edit" @click="save('salaryrate');" class="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
  </div>



</div>
</template>

<script>
import Alert from '@/components/Alert';
//Helper functions to get useful attributes
function pick(obj, keys) {
    return keys.map(k => k in obj ? {[k]: obj[k]} : {})
               .reduce((res, o) => Object.assign(res, o), {});
}

function reject(obj, keys) {
    const vkeys = Object.keys(obj)
        .filter(k => !keys.includes(k));
    return pick(obj, vkeys);
}

function capitalize_first_letter(txt) {
    return txt.charAt(0).toUpperCase() +  txt.slice(1);
}

function generate_form_label(key){
    var str = key.replace(/_/gi," ");
    var label = capitalize_first_letter(str);
    return label;
}

export default {
  name: 'ratemanager',
  data () {
      return {
        rates : {
          feerate: {},
          salaryrate: {},
          royaltyrate: {}
        },
        attr: {
          salaryrate: {
            edit: false,
          },
          feerate: {
            edit: false,
          },
          royaltyrate: {
            edit: false,
          },
        },
        alert:{
          message: '',
          type: '',
          raised: false
        },
    }
  },
  methods: {
    fetchRates(){
      this.fetch('feerate');
      this.fetch('salaryrate');
      this.fetch('royaltyrate');
    },
    fetch(item){
      this.$http.get('http://localhost:8000/api/' + item + '/')
                    .then(function (response) {
                        this.rates[item] = response.data[0];
                        //this.rates['form_'+item] = this.formize(response.data[0])
                      });
    },
    formize(obj){
      var new_obj = {};
      for (var key in reject(obj,['id','date'])){
        var new_key = generate_form_label(key);
        new_obj[new_key] = obj[key];
      };
      return new_obj;
    },
    edit(item){
      this.attr[item].edit = true;
    },
    save(item){
      this.attr[item].edit = false;
      this.$http.put('http://localhost:8000/api/' + item + '/1/',this.rates[item])
                    .then(function (response) {
                        this.raiseAlert(capitalize_first_letter(item.slice(0,-4)) + ' ' + item.slice(-4) + ' edited','success');
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
    this.fetchRates();
  },
  components: {
    Alert
  }
}
</script>

<style lang="css">
</style>
