/**
 * 创建单位
 */
import React, { useState } from 'react'
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd'
import { serviceCreateCompany, serviceUpdateCompany } from '@/services'
import { formatDate } from '@/utils'
import dayjs from 'dayjs'

const { TextArea } = Input

const formLayoutItem = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  detail: { [key: string]: any }
}

const CreateCompanyModal: React.FC<Props> = function ({
  visible,
  detail,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const isEdit = detail.id
  const title = isEdit ? '编辑单位' : '新增单位'

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params: any = {
        companyName: values.companyName,
        startDate: formatDate(values.startDate),
        amount: Number(values.amount),
        remark: values.remark.trim(),
      }

      if (values.endDate) {
        params.endDate = formatDate(values.endDate)
      }
      if (values.expectLeaveDate) {
        params.expectLeaveDate = formatDate(values.expectLeaveDate)
      }

      setSubmitting(true)
      ;(!isEdit
        ? serviceCreateCompany(params)
        : serviceUpdateCompany(detail.id, params)
      )
        .then(() => {
          onSuccess()
        })
        .finally(() => {
          setSubmitting(false)
        })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form form={form} preserve={false} {...formLayoutItem}>
        <Form.Item
          name="companyName"
          label="单位名称"
          initialValue={detail.companyName}
          rules={[
            {
              required: true,
              message: '请输入单位名称',
            },
          ]}
        >
          <Input maxLength={200} placeholder="请输入" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="入职日期"
          initialValue={detail.startDate && dayjs(detail.startDate)}
          rules={[
            {
              required: true,
              message: '请选择日期',
            },
          ]}
        >
          <DatePicker allowClear={false} className="!w-full" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="离职日期"
          initialValue={detail.endDate && dayjs(detail.endDate)}
        >
          <DatePicker className="!w-full" />
        </Form.Item>

        <Form.Item
          name="expectLeaveDate"
          label="期望离开"
          initialValue={detail.expectLeaveDate && dayjs(detail.expectLeaveDate)}
        >
          <DatePicker className="!w-full" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="薪资"
          initialValue={detail.amount}
          rules={[
            {
              required: true,
              message: '请输入薪资',
            },
          ]}
        >
          <InputNumber
            min={1}
            max={99999999}
            className="!w-full"
            placeholder="请输入"
            precision={2}
          />
        </Form.Item>

        <Form.Item
          name="remark"
          label="备注"
          initialValue={detail.remark ?? ''}
        >
          <TextArea rows={3} maxLength={200} placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateCompanyModal)
