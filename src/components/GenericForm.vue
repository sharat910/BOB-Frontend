<template>
    <div :class="resource + 'form'">
    <Alert v-if="alert.raised" :message="alert.message" :type="alert.type" @alertClosed="closeAlert()"/>
    <vue-form-generator
    @validated="onValidated"
    :schema="schema"
    :model="model"
    :options="formOptions"
    />

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
    name: 'modelform',
    props: {
      resource: String,
      mode: String,
      reject_attributes: {
        type: Array,
        default: function(){
            return []
        }
      },
      relatedResourceMap: Object,
      id: Number
    },
    data () {
        return {
        model: {},
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
            this.postResource()
          else
            this.raiseAlert("Please fix the form errors!",'danger')
        },
        postResource(){
          if (this.mode === 'Add') {
                restAPI.post(this.resource + '/', this.model)
                    .then(response => {
                        this.raiseAlert(this.resource + ' added succesfully','success');
                        this.$emit('resourceUpdated');
                    }).catch(e => {
                      console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                    });

            } else if (this.mode === 'Edit'){
              restAPI.put(this.resource + '/' + this.id + '/', this.model)
                  .then(response => {
                      this.raiseAlert(this.resource + ' edited succesfully','success');
                      this.$emit('resourceUpdated');
                  }).catch(e => {
                    console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
                  });
            }
        },
        fetchResource(id){
            // console.log("Fetching resource",this.resource,id)
            restAPI.get(this.resource + '/'+id + '/')
            .then(response => {
              this.model = response.data;
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
            });
        },
        setRelatedResourcesSchema(model_name,resource_name,val){
            restAPI.get(resource_name+'/')
            .then( response => {
              {
                var field = {};
                var data_array = response.data;
                field['model'] = model_name;
                field['label'] = val['label'];
                field['required'] = true
                field['type'] = 'select';
                var choices = [];
                for (var i in data_array){
                  var choice = data_array[i];
                  var select_choice = {
                    value: choice['id'],
                    name: choice['summary']
                  };
                  choices.push(select_choice);
                }
                field['values'] = choices;
                field['selectOptions'] = {
                  noneSelectedText: "Please select a value",
                  value: 'value',
                  name: 'name'
                };
                field['validator'] = VueFormGenerator.validators.required;
                this.schema.fields.push(field);
              }
            }).catch(e => {
              console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
            });
        },
        fetchFormData(){
          restAPI.options(this.resource + '/')
          .then(response => {
            this.setFormSchema(response.data,[],this.postResource);
          }).catch(e => {
            console.error(e);console.error(e.response);this.raiseAlert('Error! Please check console for more information.','danger')
          });
        },
        setFormSchema(options_data){
          var field_object = options_data['actions']['POST'];
          field_object = reject(field_object,this.reject_attributes);
          for (var key in field_object){
            var val = field_object[key];
            if (val['read_only'] == true)
              continue
            if (val['type'] === 'field'){
              var resource_name = key;
              var val_copy = Object.assign({},val);
              if (this.relatedResourceMap != undefined)
                if (key in this.relatedResourceMap)
                  resource_name = this.relatedResourceMap[key];
              this.setRelatedResourcesSchema(key,resource_name,val_copy);
              continue;
            }
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
              var choices = [];
              for (var i in val.choices){
                var choice = val.choices[i];
                var select_choice = {
                  value: choice['value'],
                  name: choice['display_name']
                };
                choices.push(select_choice);
              }
              t['values'] = choices;
              t['selectOptions'] = {
                noneSelectedText: "Please select a value",
                value: 'value',
                name: 'name'
              }
              t['validator'] = VueFormGenerator.validators.required;

            } else if (val['type'] === 'boolean') {

              t['type'] = 'checkbox';
              t['default'] = false;

            } else if (val['type'] === 'date') {

              t['type'] = 'dateTimePicker';
              t['format'] = "YYYY-MM-DD";
              t['dateTimePickerOptions']= {format: "YYYY-MM-DD"},
              t['validator'] = VueFormGenerator.validators.date;

            }
            this.schema.fields.push(t);
          }
          setTimeout(this.addSubmitButton,500);
        },
        addSubmitButton(){
          this.schema.fields.push({
            type: 'submit',
            buttonText: 'Save',
            fieldClasses: 'btn btn-primary',
            validateBeforeSubmit: true
          })
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
        // console.log(data_array)
        if (this.mode === 'Edit'){
          // console.log('In created')
          this.fetchResource(this.id);
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
