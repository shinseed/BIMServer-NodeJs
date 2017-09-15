

<template>

<section class="container"  >
    <el-card class="box-card" style="width:400px;margin:0 auto">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">登录</span>
        </div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="60px" class="demo-dynamic">
            <el-form-item prop="email" label="账号" :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]">
                <el-input v-model="dynamicValidateForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="value" :rules="[
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]">
                <el-input type='password' v-model="dynamicValidateForm.value"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                <el-button @click="resetForm('dynamicValidateForm')">注册</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</section>

</template>

<script>

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
