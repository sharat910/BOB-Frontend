import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'

import CentreList from '@/components/centre/CentreList'
import ExpenditureList from '@/components/expenditure/ExpenditureList'
import Rate from '@/components/admin/Rate'

import ItemList from '@/components/stock/ItemList'
import ItemDetails from '@/components/stock/ItemDetails'

import Students from '@/components/students/Students'
import StudentDetails from '@/components/students/StudentDetails'
import StudentForm from '@/components/students/StudentForm'

import Teachers from '@/components/teachers/Teachers'
import TeacherDetails from '@/components/teachers/TeacherDetails'
import TeacherForm from '@/components/teachers/TeacherForm'

import Batches from '@/components/batches/Batches'
import BatchDetails from '@/components/batches/BatchDetails'
import BatchForm from '@/components/batches/BatchForm'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Rate
    },
    {
      path: '/centres',
      name: 'Centres',
      component: CentreList
    },
    {
      path: '/stock/items',
      name: 'ItemList',
      component: ItemList
    },
    {
      path: '/stock/item/:id',
      name: 'ItemDetails',
      component: ItemDetails,
      props: true
    },
    {
      path: '/students',
      name: 'Students',
      component: Students
    },
    {
      path: '/student/:id',
      name: 'StudentDetails',
      component: StudentDetails,
      props: true
    },
    {
      path: '/add/student/',
      name: 'AddStudent',
      component: StudentForm,
      props: {
        mode: 'Add'
      }
    },
    {
      path: '/edit/student/:id',
      name: 'EditStudent',
      component: StudentForm,
      props: {
        default: true,
        mode: 'Edit',
      }
    },

    {
      path: '/teachers',
      name: 'Teachers',
      component: Teachers
    },
    {
      path: '/teacher/:id',
      name: 'TeacherDetails',
      component: TeacherDetails,
      props: true
    },
    {
      path: '/add/teacher/',
      name: 'AddTeacher',
      component: TeacherForm,
      props: {
        mode: 'Add'
      }
    },
    {
      path: '/edit/teacher/:id',
      name: 'EditTeacher',
      component: TeacherForm,
      props: {
        default: true,
        mode: 'Edit'
      }
    },

    {
      path: '/batches',
      name: 'Batches',
      component: Batches
    },
    {
      path: '/batch/:id',
      name: 'BatchDetails',
      component: BatchDetails,
      props: true
    },
    {
      path: '/add/batch/',
      name: 'AddBatch',
      component: BatchForm,
      props: {
        mode: 'Add'
      }
    },
    {
      path: '/edit/batch/:id',
      name: 'EditBatch',
      component: BatchForm,
      props: {
        default: true,
        mode: 'Edit'
      }
    },
    {
      path: '/expenditures',
      name: 'Expenditures',
      component: ExpenditureList
    },

  ]
})
