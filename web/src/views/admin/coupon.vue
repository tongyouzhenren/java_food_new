<template>
  <div>
    <div class="page-view">
      <div class="table-operations">
        <a-space>
          <a-button type="primary" @click="handleAdd">新增</a-button>
          <a-button @click="handleBatchDelete">批量删除</a-button>
        </a-space>
      </div>
      <a-table
          size="middle"
          rowKey="id"
          :loading="data.loading"
          :columns="columns"
          :data-source="data.couponList"
          :scroll="{ x: 'max-content' }"
          :row-selection="rowSelection"
          :pagination="{
          size: 'default',
          current: data.page,
          pageSize: data.pageSize,
          onChange: (current) => (data.page = current),
          showSizeChanger: false,
          showTotal: (total) => `共${total}条数据`,
        }"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key === 'operation'">
            <span>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除?" ok-text="是" cancel-text="否" @confirm="confirmDelete(record)">
                <a href="#">删除</a>
              </a-popconfirm>
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag v-if="text === '1'" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
          <template v-else-if="column.key === 'expireTime'">
            <span>{{ formatExpireTime(text) }}</span>
          </template>
        </template>
      </a-table>
    </div>

    <div>
      <a-modal
          :visible="modal.visile"
          :forceRender="true"
          :title="modal.title"
          ok-text="确认"
          cancel-text="取消"
          @cancel="handleCancel"
          @ok="handleOk"
      >
        <a-form ref="myform" :label-col="{ style: { width: '100px' } }" :model="modal.form" :rules="modal.rules">
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item label="优惠券名称" name="title">
                <a-input placeholder="请输入" v-model:value="modal.form.title"></a-input>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="优惠口令" name="code">
                <a-input placeholder="请输入" v-model:value="modal.form.code"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item label="优惠金额" name="discountAmount">
                <a-input placeholder="请输入金额" v-model:value="modal.form.discountAmount"></a-input>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="是否启用" name="status">
                <a-switch v-model:checked="modal.form.status" checked-value="1" unchecked-value="0"></a-switch>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item label="过期时间">
                <a-input placeholder="13位时间戳，留空则长期有效" v-model:value="modal.form.expireTime"></a-input>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="备注">
                <a-input placeholder="请输入" v-model:value="modal.form.remark"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FormInstance, message} from 'ant-design-vue';
import {createApi, deleteApi, listApi, updateApi} from '/@/api/coupon';

const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'title',
    key: 'title',
    align: 'center'
  },
  {
    title: '口令',
    dataIndex: 'code',
    key: 'code',
    align: 'center'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  },
  {
    title: '过期时间',
    dataIndex: 'expireTime',
    key: 'expireTime',
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    customRender: ({ text }) => text?.substring(0, 30)
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'operation',
    align: 'center',
    fixed: 'right',
    width: 160,
  },
]);

const data = reactive({
  couponList: [],
  loading: false,
  selectedRowKeys: [] as any[],
  pageSize: 10,
  page: 1,
});

const modal = reactive({
  visile: false,
  editFlag: false,
  title: '',
  form: {
    id: undefined,
    title: undefined,
    code: undefined,
    discountAmount: undefined,
    status: '1',
    expireTime: undefined,
    remark: undefined,
  },
  rules: {
    title: [{ required: true, message: '请输入', trigger: 'change' }],
    code: [{ required: true, message: '请输入', trigger: 'change' }],
    discountAmount: [{ required: true, message: '请输入', trigger: 'change' }],
  },
});

const myform = ref<FormInstance>();

onMounted(() => {
  getDataList();
});

const formatExpireTime = (value: any) => {
  if (!value) {
    return '长期有效';
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return value;
  }
  const date = new Date(num);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getDataList = () => {
  data.loading = true;
  listApi({})
      .then((res) => {
        data.loading = false;
        res.data.forEach((item: any, index: any) => {
          item.index = index + 1;
        });
        data.couponList = res.data;
      })
      .catch((err) => {
        data.loading = false;
        console.log(err);
      });
};

const rowSelection = ref({
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    data.selectedRowKeys = selectedRowKeys;
  },
});

const handleAdd = () => {
  resetModal();
  modal.visile = true;
  modal.editFlag = false;
  modal.title = '新增';
  modal.form.status = '1';
};

const handleEdit = (record: any) => {
  resetModal();
  modal.visile = true;
  modal.editFlag = true;
  modal.title = '编辑';
  for (const key in modal.form) {
    // @ts-ignore
    modal.form[key] = record[key];
  }
};

const buildFormData = () => {
  const formData = new FormData();
  if (modal.form.title) { formData.append('title', modal.form.title as any); }
  if (modal.form.code) { formData.append('code', modal.form.code as any); }
  if (modal.form.discountAmount) { formData.append('discountAmount', modal.form.discountAmount as any); }
  if (modal.form.status !== undefined) { formData.append('status', modal.form.status as any); }
  if (modal.form.expireTime) { formData.append('expireTime', modal.form.expireTime as any); }
  if (modal.form.remark) { formData.append('remark', modal.form.remark as any); }
  if (modal.form.id) { formData.append('id', modal.form.id as any); }
  return formData;
};

const confirmDelete = (record: any) => {
  deleteApi({ ids: record.id })
      .then(() => {
        getDataList();
      })
      .catch((err) => {
        message.error(err.msg || '操作失败');
      });
};

const handleBatchDelete = () => {
  if (data.selectedRowKeys.length <= 0) {
    message.warn('请勾选删除项');
    return;
  }
  deleteApi({ ids: data.selectedRowKeys.join(',') })
      .then(() => {
        message.success('删除成功');
        data.selectedRowKeys = [];
        getDataList();
      })
      .catch((err) => {
        message.error(err.msg || '操作失败');
      });
};

const handleOk = () => {
  myform.value
      ?.validate()
      .then(() => {
        const formData = buildFormData();
        if (modal.editFlag) {
          updateApi({}, formData)
              .then(() => {
                hideModal();
                getDataList();
              })
              .catch((err) => {
                message.error(err.msg || '操作失败');
              });
        } else {
          createApi(formData)
              .then(() => {
                hideModal();
                getDataList();
              })
              .catch((err) => {
                message.error(err.msg || '操作失败');
              });
        }
      })
      .catch(() => {
        console.log('不能为空');
      });
};

const handleCancel = () => {
  hideModal();
};

const resetModal = () => {
  myform.value?.resetFields();
  for (const key in modal.form) {
    // @ts-ignore
    modal.form[key] = undefined;
  }
  modal.form.status = '1';
};

const hideModal = () => {
  modal.visile = false;
};
</script>

<style scoped lang="less">
.page-view {
  min-height: 100%;
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.table-operations {
  margin-bottom: 16px;
  text-align: right;
}

.table-operations > button {
  margin-right: 8px;
}
</style>
