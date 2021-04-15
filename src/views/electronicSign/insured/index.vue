<template>
    <div class="app-container">
        <div class="filter-container">
            <el-select v-model="listQuery.orderState" placeholder="订单状态" clearable style="width: 200px"
                       class="filter-item">
                <el-option v-for="item in orderStateList" :key="item.key" :label="item.name" :value="item.key"/>
            </el-select>
            <el-select v-model="listQuery.insureState" placeholder="保险状态" clearable style="width: 200px"
                       class="filter-item">
                <el-option v-for="item in insureStateList" :key="item.key" :label="item.name" :value="item.key"/>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                Search
            </el-button>
            <el-button class="filter-item" @click="handleReset">重置</el-button>
        </div>
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
            <el-table-column label="订单号" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.orderNo }}
                </template>
            </el-table-column>
            <el-table-column label="姓名" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.userName }}
                </template>
            </el-table-column>
            <el-table-column label="手机号" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.userPhone }}
                </template>
            </el-table-column>
            <el-table-column label="客户评级" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.userLevel }}
                </template>
            </el-table-column>
            <el-table-column label="借款金额" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.loanAmount }}
                </template>
            </el-table-column>
            <el-table-column label="出借协议" min-width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.docNo }}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="订单状态" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.orderState }}
                </template>
            </el-table-column>
            <el-table-column label="保险状态" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.insureFlag }}
                </template>
            </el-table-column>
            <el-table-column label="投保时间" min-width="100">
                <template slot-scope="scope">
                    {{ scope.row.insureTime }}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" min-width="100">
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
		{ key: '313', name: '待借款人签字' },
		{ key: '304', name: '放款中' },
		{ key: '30', name: '放款成功' },
		{ key: '99', name: '取消' }
	];
	const insureStateList = [
		{ key: '0', name: '未购买' },
		{ key: '1', name: '已购买' },
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
					docIds.push(value.docId)
				});
				docIds = docIds.toString();
				this.docIds = docIds;
			},
			//批量签字
			batchSign() {
				if (this.multipleSelection.length !== 0) {
					if (this.state == 10) {
						this.$confirm(this.multipleSelection.length + ' kontrak telah dipilih untuk Anda, konfirmasi penandatanganan batch?', 'E-sign', {
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
