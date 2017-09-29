

<template>

<section class="container">
    <el-card class="box-card" style="width:400px;margin:0 auto">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">注册</span>
        </div>
        <el-form :model="ruleFromSign" :rules="rules2" ref="ruleFromSign" label-width="60px" class="demo-dynamic">
            <el-form-item label="账号" prop="email">
                <el-input v-model="ruleFromSign.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleFromSign.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认" prop="checkPass">
                <el-input type="password" v-model="ruleFromSign.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm('dynamicValidateForm')">注册</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</section>

</template>

<script>

import axios from '~/plugins/axios-config';
export default {
    head() {
            return {
                title: `sign-in Page (${this.name}-side)`
            }
        },
        asyncData({
            req
        }) {
            return {
                name: req ? 'server' : 'client',
            }
        },
        data() {
            var checkEmail = (rule, value, callback) => {
                let RegEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (!RegEmail.test(value)) {
                    return callback(new Error('请输入正确的邮箱'));
                }
                axios.get('/api/isRepeatEmail', {
                    params: {
                        email: value
                    }
                }).then(({
                    data
                }) => {
                    if (data.results) {
                        callback(new Error('已存在该邮箱'));
                    } else {
                        callback();
                    }
                })
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleFromSign.checkPass !== '') {
                        this.$refs.ruleFromSign.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleFromSign.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleFromSign: {
                    pass: '',
                    checkPass: '',
                    email: ''
                },
                rules2: {
                    pass: [{
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    checkPass: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }],
                    email: [{
                        trigger: 'blur',
                        validator: checkEmail
                    }]
                }
            };
        },
        methods: {
            submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            alert('submit!');
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                }
        }
}

</script>
