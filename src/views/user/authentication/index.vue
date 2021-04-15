<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
            <el-form-item label="No.HP" prop="phone">
                <el-input v-model="form.phone" disabled/>
            </el-form-item>
            <el-form-item label="E-mail" prop="email">
                <el-input v-model="form.email" disabled/>
            </el-form-item>
            <el-form-item label="Photo KTP" prop="ktpImg">
                <el-upload
                    class="upload-demo"
                    ref="upload1"
                    :limit="1"
                    accept="image/*"
                    capture="camera"
                    action="/lender/auth/info/submit"
                    list-type="picture-card"
                    :on-change="onChange1"
                    :on-remove="handleRemove"
                    :auto-upload="false">
                </el-upload>
            </el-form-item>
            <el-form-item label="Selfie photo" prop="selfieImg">
                <el-upload
                        class="upload-demo"
                        ref="upload2"
                        :limit="1"
                        accept="image/*"
                        capture="camera"
                        action="/lender/auth/info/submit"
                        list-type="picture-card"
                        :on-change="onChange2"
                        :on-remove="handleRemove"
                        :auto-upload="false">
                </el-upload>
            </el-form-item>
            <el-form-item label="Nama" prop="name">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="NIK" prop="idNo">
                <el-input v-model="form.idNo"/>
            </el-form-item>
            <el-form-item label="Jenis kelamin" prop="gender">
                <el-radio-group v-model="form.gender">
                    <el-radio label="Laki-laki"/>
                    <el-radio label="Perempuan"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Tempat Lahir" prop="birthplace">
                <el-input v-model="form.birthplace"/>
            </el-form-item>
            <el-form-item label="Tgl Lahir" prop="birthday">
                <el-date-picker v-model="form.birthday" type="date" value-format="yyyy-MM-dd" style="width: 100%;"/>
            </el-form-item>
            <el-form-item label="Province" prop="province">
                <el-input v-model="form.province"/>
            </el-form-item>
            <el-form-item label="Kota" prop="city">
                <el-input v-model="form.city"/>
            </el-form-item>
            <el-form-item label="Kecamatan" prop="district">
                <el-input v-model="form.district"/>
            </el-form-item>
            <el-form-item label="Kel/Desa" prop="subDistrict">
                <el-input v-model="form.subDistrict"/>
            </el-form-item>
            <el-form-item label="Alamat" prop="liveAddr">
                <el-input v-model="form.liveAddr"/>
            </el-form-item>
            <el-form-item label="kode_pos" prop="postcode">
                <el-input v-model="form.postcode"/>
            </el-form-item>
            <p style="text-align: center">
                <el-button type="primary" :loading="loading" @click="onSubmit">Kirimkan</el-button>
                <el-button @click="onCancel">membatalkan</el-button>
            </p>
        </el-form>
    </div>
</template>

<script>
	import { authInfoSubmit, } from '@/api/authentication'
	export default {
		data() {
			const validateForm = (rule, value, callback) => {
				if (!value) {
					callback(new Error('silahkan masuk'))
				} else {
					callback()
				}
			};
			return {
				loading: false,
				form: {
					phone: sessionStorage.getItem('loginName'),
					email: sessionStorage.getItem('email'),
					ktpImg: '',
					selfieImg: '',
					name: '',
					idNo: '',
					gender: '',
					birthplace: '',
					birthday: '',
					province: '',
					city: '',
					district: '',
					subDistrict: '',
					liveAddr: '',
					postcode: '',
				},
				formRules: {
	                phone: [{required: true, trigger: 'blur', validator: validateForm}],
					email: [{required: true, trigger: 'blur', validator: validateForm}],
					ktpImg: [{required: true, trigger: 'blur', validator: validateForm}],
					selfieImg: [{required: true, trigger: 'blur', validator: validateForm}],
					name: [{required: true, trigger: 'blur', validator: validateForm}],
					idNo: [{required: true, trigger: 'blur', validator: validateForm}],
					gender: [{required: true, trigger: 'blur', validator: validateForm}],
					birthplace: [{required: true, trigger: 'blur', validator: validateForm}],
					birthday: [{required: true, trigger: 'blur', validator: validateForm}],
					province: [{required: true, trigger: 'blur', validator: validateForm}],
					city: [{required: true, trigger: 'blur', validator: validateForm}],
					district: [{required: true, trigger: 'blur', validator: validateForm}],
					subDistrict: [{required: true, trigger: 'blur', validator: validateForm}],
					liveAddr: [{required: true, trigger: 'blur', validator: validateForm}],
					postcode: [{required: true, trigger: 'blur', validator: validateForm}],
                },
			}
		},
		methods: {
			onChange1(file) {
				if (file){
					this.form.ktpImg = file.raw;
                }
			},
			onChange2(file) {
				if (file){
					this.form.selfieImg = file.raw;
                }
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			onSubmit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$confirm('Setelah terkirim, informasi tersebut tidak boleh diubah', 'Tip', {
							confirmButtonText: 'Konfirmasi',
							cancelButtonText: 'membatalkan',
							type: 'warning',
							center: true
						}).then(() => {
							this.loading = true;
							let data = new FormData();
							data.append('phone', this.form.phone);
							data.append('email', this.form.email);
							data.append('ktpImg', this.form.ktpImg);
							data.append('selfieImg', this.form.selfieImg);
							data.append('name', this.form.name);
							data.append('idNo', this.form.idNo);
							data.append('gender', this.form.gender);
							data.append('birthplace', this.form.birthplace);
							data.append('birthday', this.form.birthday);
							data.append('province', this.form.province);
							data.append('city', this.form.city);
							data.append('district', this.form.district);
							data.append('subDistrict', this.form.subDistrict);
							data.append('liveAddr', this.form.liveAddr);
							data.append('postcode', this.form.postcode);
							authInfoSubmit(data).then(response => {
								if (response){
									this.$message({
										message: response.msg || 'Success',
										type: 'success',
										duration: 5 * 1000
									});
									this.$router.push({path: '/electronicSign/account'});
								}
								this.loading = false;
							}).catch(error=>{
								this.loading = false;
							});
						}).catch(error=>{
						});
					} else {
						console.log('error submit!!');
						return false
					}
				})
			},
			onCancel() {
				this.$message({
					message: 'membatalkan!',
					type: 'warning'
				})
			}
		}
	}
</script>

<style scoped>
    .line {
        text-align: center;
    }
</style>

