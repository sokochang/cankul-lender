<template>
    <div class="app-container">
        <div class="filter-container">
            <el-select v-model="listQuery.orderState" placeholder="Status Pesanan" clearable style="width: 200px"
                       class="filter-item">
                <el-option v-for="item in orderStateList" :key="item.key" :label="item.name" :value="item.key"/>
            </el-select>
            <el-select v-model="listQuery.insureState" placeholder="Status asuransi" clearable style="width: 200px"
                       class="filter-item">
                <el-option v-for="item in insureStateList" :key="item.key" :label="item.name" :value="item.key"/>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Pencarian</el-button>
            <el-button class="filter-item" @click="handleReset">Setel Ulang</el-button>
        </div>
        <el-button type="primary" :loading="loading" @click="batchSign" class="batchSign">Mengasuransikan secara batch</el-button>
        <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
                @selection-change="handleSelectionChange"
        >
            <el-table-column
                    type="selection"
                    :selectable="selectable"
                    width="55">
            </el-table-column>
            <el-table-column label="Nomor pesanan" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.orderNo }}
                </template>
            </el-table-column>
            <el-table-column label="Nama" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.userName }}
                </template>
            </el-table-column>
            <el-table-column label="Nomor ponsel" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.userPhone }}
                </template>
            </el-table-column>
            <el-table-column label="Peringkat Pelanggan" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.userLevel }}
                </template>
            </el-table-column>
            <el-table-column label="Jumlah Pinjaman" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.loanAmount }}
                </template>
            </el-table-column>
            <el-table-column label="Perjanjian pinjaman" min-width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.docNo }}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="Status Pesanan" min-width="100">
                <template slot-scope="scope">
                    <span v-if='scope.row.orderState==313'>Untuk ditandatangani oleh peminjam</span>
                    <span v-if='scope.row.orderState==304 || scope.row.orderState==302'>Pencairan Sedang Proses</span>
                    <span v-if='scope.row.orderState==30'>Pinjaman Sukses</span>
                    <span v-if='scope.row.orderState==99'>Tidak</span>
                </template>
            </el-table-column>
            <el-table-column label="Status asuransi" min-width="100">
                <template slot-scope="scope">
                    <span v-if='scope.row.insureFlag==1'>Dibeli</span>
                    <span v-if='scope.row.insureFlag==0'>Tidak dibeli</span>
                </template>
            </el-table-column>
            <el-table-column label="Waktu yang diasuransikan" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.insureTime }}
                </template>
            </el-table-column>
            <el-table-column label="Perbaharui Waktu" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.loanTime }}
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                    @pagination="fetchData"/>
    </div>
</template>

<script>
	import {getList, batchSign, checkContract} from '@/api/insured'
	import Pagination from '@/components/Pagination'
	const orderStateList = [
		{ key: '313', name: 'Untuk ditandatangani oleh peminjam' },
		{ key: '304', name: 'Pencairan Sedang Proses' },
		{ key: '30', name: 'Pinjaman Sukses' },
		{ key: '99', name: 'Tidak' }
	];
	const insureStateList = [
		{ key: '0', name: 'Tidak dibeli' },
		{ key: '1', name: 'Dibeli' },
	];
	export default {
		components: {Pagination},
		data() {
			return {
				state: sessionStorage.getItem('state'),
				list: null,
				total: 0,
				listLoading: false,
				loading: false,
				listQuery: {
					lenderId: sessionStorage.getItem('lenderId'),
					current: 1,
					pageSize: 10,
					orderState: undefined,
					insureState: undefined,
				},
				orderStateList,
				insureStateList,
				multipleSelection: [],
				docIds: ''
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				this.listLoading = true;
				getList(this.listQuery).then(response => {
					this.list = response.data;
					this.total = response.page.total;
					this.listLoading = false
				}).catch(error => {
					this.listLoading = false;
				});
			},
			handleFilter() {
				this.listQuery.current = 1;
				this.fetchData()
			},
            //重置
			handleReset(){
				this.listQuery.current = 1;
				this.listQuery.pageSize = 10;
				this.listQuery.orderState = undefined;
				this.listQuery.insureState = undefined;
				this.fetchData()
            },
			//选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
				let docIds = [];
				val.map(function (value, index, array) {
					docIds.push(value.orderNo)
				});
				docIds = docIds.toString();
				this.docIds = docIds;
			},
			selectable(row, index){
                if (row.orderState == 30 && row.insureFlag == 0){
                	return true //启用
                } else {
                	return false //禁用
                }
            },
			//批量签字
			batchSign() {
				if (this.multipleSelection.length !== 0) {
					if (this.state == 10) {
						this.$confirm('Sudah memilih pesanan '+ this.multipleSelection.length +', apakah Anda yakin membeli asuransi?', 'Diasuransikan', {
							confirmButtonText: 'Konfirmasi',
							cancelButtonText: 'membatalkan',
							type: 'warning',
							center: true
						}).then(() => {
							this.loading = true;
							let data = {
								lenderId: this.listQuery.lenderId,
								orderNos: this.docIds,
							};
							batchSign(data).then(response => {
								if (response) {
									window.open(response.data.signLink);
								}
								this.loading = false
							}).catch(error => {
								this.loading = false;
							});
						}).catch(error => {
						});
					} else if (this.state == -1) {
						this.$message({
							message: 'Harap lengkapi 【Informasi Otentikasi】',
							type: 'warning'
						})
					} else {
						this.$message({
							message: 'Harap selesaikan 【Aktivasi Akun】',
							type: 'warning'
						})
					}
				}
			},
			//出借协议
			handleClick(row) {
				let data = {
					borrowId: row.borrowId,
				};
				checkContract(data).then(response => {
					let newWin = window.open('', '_blank');
					newWin.document.write(response);
				}).catch(error => {
				});
			}
		}
	}
</script>

<style scoped>
    .batchSign {
        margin: 20px 0;
    }
</style>
