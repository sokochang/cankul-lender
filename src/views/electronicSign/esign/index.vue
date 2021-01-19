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
            <el-table-column label="Kontrak No" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.docId }}
                </template>
            </el-table-column>
            <el-table-column label="Nama debit" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.borrowName }}
                </template>
            </el-table-column>
            <el-table-column label="Nomor ID Debit" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.borrowIdNo }}
                </template>
            </el-table-column>
            <el-table-column label="Jumlah pinjaman" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.loanAmount }}
                </template>
            </el-table-column>
            <el-table-column label="Waktu tanda tangan sisi debit" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.borrowSignTime }}
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                    @pagination="fetchData"/>
    </div>
</template>

<script>
	import {getList, batchSign,} from '@/api/esign'
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
					this.list = response.data.list;
					this.total = response.data.page.total;
					this.listLoading = false
				}).catch(error => {
					this.listLoading = false;
				});
			},
			//选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
				let docIds = [];
				val.map(function(value, index, array) {
					docIds.push(value.docId)
				});
				docIds = docIds.toString();
				this.docIds = docIds;
			},
			//批量签字
			batchSign() {
				if (this.multipleSelection.length !== 0){
					if (this.state == 2) {
						this.$confirm(this.multipleSelection.length + ' kontrak telah dipilih untuk Anda, konfirmasi penandatanganan batch?', 'E-sign', {
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

								this.loading = false
							}).catch(error => {
								this.loading = false;
							});
						}).catch(error=>{
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
		}
	}
</script>

<style scoped>
    .batchSign {
        margin-bottom: 20px;
    }
</style>
