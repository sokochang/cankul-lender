<template>
    <div class="login-container">
        <div class="title-container">
            <h3 class="title">Sistem Back End</h3>
        </div>
        <el-tabs v-model="activeName" stretch>
            <el-tab-pane label="Log In" name="first">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
                         label-position="left">
                    <el-form-item prop="loginPhone">
                        <span class="svg-container">
                             <i class="el-icon-mobile-phone"/>
                        </span>
                        <el-input
                                ref="loginPhone"
                                v-model="loginForm.loginName"
                                placeholder="Harap masukkan nomor telepon"
                                name="loginPhone"
                                type="text"
                                tabindex="1"
                                auto-complete="on"
                        />
                    </el-form-item>
                    <el-form-item prop="loginPassword">
                        <span class="svg-container">
                          <i class="el-icon-lock"/>
                        </span>
                        <el-input
                                :key="passwordType"
                                ref="loginPassword"
                                v-model="loginForm.password"
                                :type="passwordType"
                                placeholder="Harap masukkan 6-16 digit kata sandi login"
                                name="loginPassword"
                                tabindex="2"
                                auto-complete="on"
                        />
                        <span class="show-pwd" @click="showPwd">
                          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                        </span>
                    </el-form-item>
                    <el-form-item prop="imgCode">
                        <span class="svg-container">
                          <i class="el-icon-message"/>
                        </span>
                        <el-input
                                ref="imgCode"
                                v-model="loginForm.code"
                                placeholder="masukkan kode verifikasi grafis"
                                name="imgCode"
                                type="text"
                                tabindex="3"
                                auto-complete="on"
                                class="imgCode"
                                @keyup.enter.native="handleLogin"
                        />
                        <img :src="validateImg" alt="" class="validateBtn" @click="generate">
                    </el-form-item>
                    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                               @click.native.prevent="handleLogin">Log In
                    </el-button>
                </el-form>

            </el-tab-pane>

            <el-tab-pane label="Terdaftar" name="second">
                <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on"
                         label-position="left">
                    <el-form-item prop="registerPhone">
                        <span class="svg-container">
                             <i class="el-icon-mobile-phone"/>
                        </span>
                        <el-input
                                ref="registerPhone"
                                v-model="registerForm.phone"
                                placeholder="Masukkan No.Telp"
                                name="registerPhone"
                                type="text"
                                tabindex="1"
                                auto-complete="on"
                        />
                    </el-form-item>
                    <el-form-item prop="phoneCode">
                        <span class="svg-container">
                          <i class="el-icon-message"/>
                        </span>
                        <el-input
                                ref="phoneCode"
                                v-model="registerForm.phoneCode"
                                placeholder="Masukkan OTP"
                                name="phoneCode"
                                type="text"
                                tabindex="1"
                                auto-complete="on"
                                class="imgCode"
                        />
                        <el-button type="primary" class="validateBtn" :disabled="phoneDisabled" @click="phoneGetCode">
                            {{phoneValiBtn}}
                        </el-button>
                    </el-form-item>
                    <el-form-item prop="registerEmail">
                        <span class="svg-container">
                             <i class="el-icon-mobile-phone"/>
                        </span>
                        <el-input
                                ref="registerEmail"
                                v-model="registerForm.email"
                                placeholder="Masukkan Email"
                                name="registerEmail"
                                type="text"
                                tabindex="1"
                                auto-complete="on"
                        />
                    </el-form-item>
                    <el-form-item prop="emailCode">
                        <span class="svg-container">
                          <i class="el-icon-message"/>
                        </span>
                        <el-input
                                ref="emailCode"
                                v-model="registerForm.emailCode"
                                placeholder="Masukkan Kode verifikasi email"
                                name="emailCode"
                                type="text"
                                tabindex="1"
                                auto-complete="on"
                                class="imgCode"
                        />
                        <el-button type="primary" class="validateBtn" :disabled="emailDisabled" @click="emailGetCode">
                            {{emailValiBtn}}
                        </el-button>
                    </el-form-item>
                    <el-form-item prop="registerPassword">
                        <span class="svg-container">
                          <i class="el-icon-lock"/>
                        </span>
                        <el-input
                                :key="passwordType"
                                ref="registerPassword"
                                v-model="registerForm.password"
                                :type="passwordType"
                                placeholder="Masukkun password"
                                name="registerPassword"
                                tabindex="2"
                                auto-complete="on"
                                @keyup.enter.native="handleRegister"
                        />
                        <span class="show-pwd" @click="showPwd">
                          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                        </span>
                    </el-form-item>
                    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                               @click.native.prevent="handleRegister">terdaftar
                    </el-button>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { login, generate, sendPhoneCode, sendEmailCode, register, } from '@/api/user'
    export default {
        name: 'Login',
        data() {
            const validateLogin = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('silahkan masuk'))
                } else {
                    callback()
                }
            };
            const validateRegister = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('silahkan masuk'))
                } else {
                    callback()
                }
            };
            return {
                validateImg: '',
                activeName: 'first',
                loginForm: {
                    loginName: '',
                    password: '',
                    code: '',
                    securityCode: '',
                },
                loginRules: {
                    loginName: [{required: true, trigger: 'blur', validator: validateLogin}],
                    password: [{required: true, trigger: 'blur', validator: validateLogin}],
                    code: [{required: true, trigger: 'blur', validator: validateLogin}]
                },
                registerForm: {
                    phone: '',
                    phoneCode: '',
                    email: '',
                    emailCode: '',
                    password: '',
                },
                registerRules: {
                    phone: [{required: true, trigger: 'blur', validator: validateRegister}],
                    phoneCode: [{required: true, trigger: 'blur', validator: validateRegister}],
                    email: [{required: true, trigger: 'blur', validator: validateRegister}],
                    emailCode: [{required: true, trigger: 'blur', validator: validateRegister}],
                    password: [{required: true, trigger: 'blur', validator: validateRegister}],
                },
                loading: false,
                passwordType: 'password',
                redirect: undefined,
                phoneValiBtn: 'Dapatkan SMS',
                phoneDisabled: false,
                emailValiBtn: 'Dapatkan kode',
                emailDisabled: false,
            }
        },
//        watch: {
//            $route: {
//                handler: function (route) {
//                    this.redirect = route.query && route.query.redirect
//                },
//                immediate: true
//            }
//        },
        mounted(){
            this.generate();
        },

        methods: {
            generate(){
                generate().then(response => {
                    this.validateImg = response.data.srcImgData;
                    this.loginForm.securityCode = response.data.securityCode;
                })
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.loginPassword.focus()
                })
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        login(this.loginForm).then(response => {
                            if (response){
                                sessionStorage.setItem('lenderId', response.data.lenderId);
                                sessionStorage.setItem('loginName', response.data.loginName);
                                sessionStorage.setItem('token', response.data.token);
                                sessionStorage.setItem('phone', response.data.phone);
                                sessionStorage.setItem('email', response.data.email);
                                this.$router.push({path: this.redirect || '/'});
                            } else {
                            	this.loginForm.code = '';
                                this.generate();
                            }
	                        this.loading = false;
                        }).catch(error=>{
	                        this.loading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
            //phoneCode
            phoneGetCode() {
                if (this.registerForm.phone){
                    let data = {
                        phone: this.registerForm.phone
                    };
                    sendPhoneCode(data).then(response => {
                        if (response){
                            this.$message({
                                message: response.msg || 'Success',
                                type: 'success',
                                duration: 5 * 1000
                            });
                            this.tackBtn('phone');
                        }
                    })
                } else {
                    this.$message({
                        message: 'Masukkan No.Telp' || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            },
            emailGetCode() {
                if (this.registerForm.email){
                    let data = {
                        email: this.registerForm.email
                    };
                    sendEmailCode(data).then(response => {
                        if (response){
                            this.$message({
                                message: response.msg || 'Success',
                                type: 'success',
                                duration: 5 * 1000
                            });
                            this.tackBtn('email');
                        }
                    })
                } else {
                    this.$message({
                        message: 'Masukkan Email' || 'Error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            },
            //验证码倒数60秒
            tackBtn(type){
                let time = 60;
                let timer = setInterval(() => {
                    if(time == 0){
                        clearInterval(timer);
                        if (type === 'phone'){
                            this.phoneValiBtn = 'Dapatkan SMS';
                            this.phoneDisabled = false;
                        } else if (type === 'email'){
                            this.emailValiBtn = 'Dapatkan kode';
                            this.emailDisabled = false;
                        }
                    }else{
                        if (type === 'phone'){
                            this.phoneDisabled = true;
                            this.phoneValiBtn = time + 's';
                        } else if (type === 'email'){
                            this.emailDisabled = true;
                            this.emailValiBtn = time + 's';
                        }
                        time--;
                    }
                }, 1000);
            },
            handleRegister() {
                this.$refs.registerForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        register(this.registerForm).then(response => {
                            if (response){
	                            sessionStorage.setItem('lenderId', response.data.lenderId);
	                            sessionStorage.setItem('loginName', response.data.loginName);
	                            sessionStorage.setItem('token', response.data.token);
	                            sessionStorage.setItem('phone', response.data.phone);
	                            sessionStorage.setItem('email', response.data.email);
	                            this.$router.push({path: this.redirect || '/'});
                            }
	                        this.loading = false;
                        }).catch(error=>{
	                        this.loading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
        }
    }
</script>

<style lang="scss" type="text/scss">
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }

    .el-tabs__item {
        color: #ffffff;
    }
</style>

<style type="text/scss" lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;

        .el-tabs{
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 50px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 80px auto 0 auto;
                text-align: center;
                font-weight: bold;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }
    }

    .imgCode {
        width: 55%;
    }

    .validateBtn {
        display: inline-block;
        width: 35%;
        float: right;
        height: 52px;
    }
</style>
