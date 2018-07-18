<template>
    <div class="centreform">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <vue-form-generator @validated="onValidated" :schema="schema" :model="centre" :options="formOptions"></vue-form-generator>

  </div>
</template>

<script>
    import Alert from '@/components/Alert';
    import VueFormGenerator from "vue-form-generator";
    import Vue from 'vue';
    import {restAPI} from '@/services/rest-api';

    Vue.use(VueFormGenerator);

    function reject(obj, keys) {
        return Object.keys(obj)
            .filter(k => !keys.includes(k))
            .map(k => Object.assign({}, {[k]: obj[k]}))
            .reduce((res, o) => Object.assign(res, o), {});
    }

    export default {
    name: 'centreform',
    props: {
      mode: String,
      centre_id: Number
    },
    data () {
        return {
        centre: {},
        schema: {
          fields: []
        },
        formOptions: {
          validateAfterLoad: false,
          validateAfterChanged: false,
        },
        alert:{
          message: '',
          type: '',
          raised: false
        },
      }
    },
    methods: {
        onValidated(isValid,errors){
          if(isValid)
            this.postCentre()
          else
            this.raiseAlert("Please fix the form errors!",'danger')
        },
        postCentre(){
              if (this.mode === 'Add') {
                  restAPI.post('centre/', this.centre)
                      .then(response => {
                          this.raiseAlert('Centre added succesfully','success');
                          this.$emit('centreUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response)
                      });

                } else if (this.mode === 'Edit'){
                  restAPI.put('centre/' + this.centre_id + '/', this.centre)
                      .then(response => {
                          this.raiseAlert('Centre edited succesfully','success');
                          this.$emit('centreUpdated');
                      }).catch(e => {
                        console.error(e);console.error(e.response)
                      });
                }
        },
        fetchCentre(id){
            this.$http.get('http://127.0.0.1:8000/api/centre/'+id + '/')
            .then(function(response){
              this.centre = response.data;
            });
        },
        fetchFormData(){
          restAPI.options('centre')
          .then(response => {
            this.setFormSchema(response.data,[],this.postCentre);
          }).catch(e => {
            console.error(e);console.error(e.response)
          });
        },
        setFormSchema(options_data,exclude_fields=[]){
          var field_object = options_data['actions']['POST'];
          field_object = reject(field_object,exclude_fields)
          var schema_fields = [];
          for (var key in field_object){
            var val = field_object[key];
            if (val['read_only'] == true)
              continue

            var t = {};
            t['model'] = key;
            t['label'] = val['label'];
            t['required'] = val['required']
            if (val['type'] === 'string') {
              t['type'] = 'input';
              t['inputType']  = 'text';
              t['maxlength'] = val['max_length'];
              t['validator'] = VueFormGenerator.validators.string;
            } else if (val['type'] === 'email') {
              t['type'] = 'input';
              t['inputType']  = 'text';
              t['maxlength'] = val['max_length'];
              t['validator'] = VueFormGenerator.validators.email;
            } else if (val['type'] === 'choice') {
              t['type'] = 'select';
              t['values'] = function() {
                var choices = [];
                for (var choice in val['choices']){
                  var select_choice = {
                    id: choice['value'],
                    name: choice['display_name']
                  }
                }
              };
              t['validator'] = VueFormGenerator.validators.required;
            } else if (val['type'] === 'boolean') {
              t['type'] = 'checkbox';
              t['default'] = false;
            } else if (val['type'] === 'date') {
              t['type'] = 'dateTimePicker';
              t['dateTimePickerOptions']= {format: "YYYY-MM-DD"},
              t['validator'] = VueFormGenerator.validators.date;
            }
            schema_fields.push(t);
          }
          schema_fields.push({
            type: 'submit',
            buttonText: 'Save',
            fieldClasses: 'btn btn-primary',
            validateBeforeSubmit: true
          })
          this.schema.fields = schema_fields;
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
        this.fetchFormData()
        if (this.mode === 'Edit'){
          this.fetchCentre(this.centre_id);
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
