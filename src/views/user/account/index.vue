<template>
    <div class="app-container">
        <h4>Silakan ikuti langkah-langkah di bawah ini untuk menyelesaikan proses aktivasi akun (Digisign: perusahaan
            layanan pihak ketiga yang menyediakan tanda tangan elektronik)</h4>
        <div class="step">
            <el-steps direction="vertical" :active="state" finish-status="success">
                <el-step title="Mendaftar untuk akun Digisign"></el-step>
                <el-step title="Aktifkan akun Digisign"></el-step>
                <!--<el-step title="Tanda Tangan <<perjanjian antara pemberi pinjaman dengan penyelenggara>>"></el-step>-->
                <el-step title="Selesai"></el-step>
            </el-steps>
        </div>
        <el-button type="primary" v-if="state !== -1 && state !== 10" :loading="loading" @click="onSubmit(state)">{{text}}</el-button>
        <el-button type="danger" v-if="state !== -1 && state !== 10" @click="refresh">Segar</el-button>
    </div>
</template>

<script>
	import { digisignRegister, digisignActive, signCankul, } from '@/api/account'
	import { getAccountState, } from '@/api/dashboard'
	export default {
		data() {
			return {
				loading: false,
				state: Number(sessionStorage.getItem("state")),
				lenderId: sessionStorage.getItem('lenderId'),
				text: ''
			}
		},
		created() {
			this.getAccountState();
		},
		methods: {
			onSubmit(state){
				this.loading = true;
				let data = {
					lenderId: this.lenderId
				};
                if (state === 0){
	                digisignRegister(data).then(response => {
		                if (response){
			                this.$message({
				                message: response.msg || 'Success',
				                type: 'success',
				                duration: 5 * 1000
			                });
			                this.getAccountState();
		                }
		                this.loading = false;
	                }).catch(error=>{
		                this.loading = false;
	                });
                } else if (state === 1){
	                digisignActive(data).then(response => {
		                if (response){
			                window.open(response.data.activeLink);
		                }
		                this.loading = false;
	                }).catch(error=>{
		                this.loading = false;
	                });
                } else if (state === 2){
	                signCankul(data).then(response => {
		                if (response){
			                window.open(response.data.signLink);
		                }
		                this.loading = false;
	                }).catch(error=>{
		                this.loading = false;
	                });
                }
            },
            //刷新
			refresh(){
				this.getAccountState();
            },
            //获取state
			getAccountState() {
				let lenderId = {
					lenderId: this.lenderId
				};
				getAccountState(lenderId).then(response => {
					if (response){
						sessionStorage.setItem('state', response.data.state);
                        this.state = response.data.state;
						switch (this.state) {
							case 0:
								this.text = 'Pergi untuk mendaftar';
								break;
							case 1:
								this.text = 'Pergi aktifkan';
								break;
							case 2:
								this.text = 'Masuk';
								break;
						}
                    }
				})
			}
        }
	}
</script>

<style scoped>
    .step {
        height: 300px;
        margin-bottom: 20px;
    }
</style>

