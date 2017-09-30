

<template>

<section class="container">
    <el-card class="box-card" style="width:600px;margin:0 auto">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">Sign up for BIMServer-NodeJs</span>
        </div>
        <el-form :model="ruleFromSign" :rules="rules2" ref="ruleFromSign" class="demo-dynamic">
            <el-form-item label="email" prop="email">
                <el-input v-model="ruleFromSign.email"></el-input>
            </el-form-item>
            <el-form-item label="password" prop="pass">
                <el-input type="password" v-model="ruleFromSign.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Again password" prop="checkPass">
                <el-input type="password" v-model="ruleFromSign.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submitForm('ruleFromSign')">Submit</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</section>

</template>

<script>
import md5 from 'md5';
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
                    return callback(new Error('email format error'));
                }
                axios.get('/api/NotCheckToken/isRepeatEmail', {
                    params: {
                        email: md5(value)
                    }
                }).then(({
                    data
                }) => {
                    if (data.success) {
                        callback(new Error('Repeat email address'));
                    } else {
                        callback();
                    }
                })
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter the password'));
                } else {
                    if (this.ruleFromSign.checkPass !== '') {
                        this.$refs.ruleFromSign.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter the password'));
                } else if (value !== this.ruleFromSign.pass) {
                    callback(new Error('Two input password is not consistent!'));
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
                            axios.post('/api/NotCheckToken/registerUser', {
                                email: md5(this.ruleFromSign.email),
                                password: md5(this.ruleFromSign.pass)
                            }).then(({
                                data
                            }) => {
                                localStorage.setItem('BIM',data.value.token);
                                this.$router.push('/');
                            })
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
