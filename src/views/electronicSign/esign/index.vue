<template>
    <div class="app-container">
        <el-button type="primary" :loading="loading" @click="batchSign" class="batchSign">Penandatanganan batch
        </el-button>
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
            <el-table-column label="Waktu menciptakan" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.createTime }}
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                    @pagination="fetchData"/>
    </div>
</template>

<script>
	import {getList, batchSign, checkContract} from '@/api/esign'
	import Pagination from '@/components/Pagination'

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
				},
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
			//选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
				let docIds = [];
				val.map(function (value, index, array) {
					docIds.push(value.docId)
				});
				docIds = docIds.toString();
				this.docIds = docIds;
			},
			//批量签字
			batchSign() {
				if (this.multipleSelection.length !== 0) {
					if (this.state == 10) {
						this.$confirm('Sudahkah Anda memilih '+ this.multipleSelection.length +' kontrak, apakah Anda sudah mengonfirmasi bahwa Anda menyetujui pinjaman dan menandatanganinya?', 'E-sign', {
							confirmButtonText: 'Konfirmasi',
							cancelButtonText: 'membatalkan',
							type: 'warning',
							center: true
						}).then(() => {
							this.loading = true;
							let data = {
								lenderId: this.listQuery.lenderId,
								docIds: this.docIds,
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
        margin-bottom: 20px;
    }
</style>
