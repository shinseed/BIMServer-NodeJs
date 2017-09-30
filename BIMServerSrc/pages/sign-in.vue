

<template>

<section class="container">
    <el-card class="box-card" style="width:600px;margin:0 auto">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">Sign in</span>
        </div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic">
            <el-form-item prop="email" label="email" :rules="[
          { required: true, message: 'Please enter the email', trigger: 'blur' },
          { type: 'email', message: 'Email format error', trigger: 'blur,change' }
        ]">
                <el-input v-model="dynamicValidateForm.email"></el-input>
            </el-form-item>
            <el-form-item label="password" prop="value" :rules="[
          { required: true, message: 'Password cannot be empty', trigger: 'blur' }
        ]">
                <el-input type='password' v-model="dynamicValidateForm.value"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dynamicValidateForm')">Submit</el-button>
                <el-button @click="resetForm('dynamicValidateForm')">Sign up</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</section>

</template>

<script>

import md5 from 'md5';
import axios from '~/plugins/axios-config';
export default {
    asyncData({
            req
        }) {
            return {
                name: req ? 'server' : 'client',
                dynamicValidateForm: {
                    value: '',
                    email: ''
                }
            }
        },
        head() {
            return {
                title: `Login Page (${this.name}-side)`
            }
        },
        mounted() {
            document.onkeydown = (event) => {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) { // enter 键
                    // if (this.$route.path == '/login') {
                    this.submitForm('dynamicValidateForm')
                        // }

                }
            }
        },
        methods: {
            submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            axios.get('/api/NotCheckToken/login', {
                                params: {
                                    email: md5(this.dynamicValidateForm.email),
                                    password: md5(this.dynamicValidateForm.value)
                                }
                            }).then(({
                                data
                            }) => {
                                if (data.success) {
                                    localStorage.BIM = data.value.token;
                                    this.$router.push('/');
                                } else {
                                    this.$notify.error({
                                        title: 'error',
                                        message: data.message
                                    });
                                }
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                resetForm(formName) {
                    this.$router.push('sign-up')
                }
        }
}

</script>
