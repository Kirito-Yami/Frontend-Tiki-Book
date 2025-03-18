import {useEffect, useState} from "react";
import {App, Form, FormProps, Input, Modal} from "antd";
import {updateUserAPI} from "services/api.ts";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (values: boolean) => void;
    dataUpdateUser: IUserTable | null;
    setDataUpdateUser: (values: IUserTable | null) => void;
    refreshTable: () => void;
}

interface FieldType {
    _id: string;
    fullName: string;
    email: string;
    phone: number;
}

const UpdateUser = (props: IProps) => {
    const {openModalUpdate, setOpenModalUpdate, dataUpdateUser, setDataUpdateUser, refreshTable} = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const {message, notification} = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdateUser) {
            form.setFieldsValue({
                _id: dataUpdateUser._id,
                fullName: dataUpdateUser.fullName,
                email: dataUpdateUser.email,
                phone: dataUpdateUser.phone
            })
        }
    }, [dataUpdateUser])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const {_id, fullName, phone} = values;
        const res = await updateUserAPI(_id, fullName, phone);
        if (res && res.data) {
            message.success("Đăng ký user thành công!");
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdateUser(null);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdateUser(null);
        form.resetFields();
    }

    return (
        <Modal
            title="Cập nhật người dùng"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={onClose}
            okText={"Cập nhật"}
            cancelText={"Hủy"}
            confirmLoading={isSubmit}
        >
            <Form
                form={form}
                name="form-edit-user"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    hidden
                    labelCol={{span: 24}} //whole column
                    label="ID"
                    name="_id"
                    rules={[
                        {required: true, message: 'Id không được để trống!'}
                    ]}
                >
                    <Input disabled style={{borderRadius: "999px", height: "40px"}} placeholder="Nhập id..."/>
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{span: 24}} //whole column
                    label="Email"
                    name="email"
                    rules={[
                        {required: true, message: 'Email không được để trống!'},
                        {type: "email", message: "Email không đúng định dạng!"}
                    ]}
                >
                    <Input disabled style={{borderRadius: "999px", height: "40px"}} placeholder="Nhập email..."/>
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{span: 24}} //whole column
                    label="Họ tên"
                    name="fullName"
                    rules={[{required: true, message: 'Họ tên không được để trống!'}]}
                >
                    <Input style={{borderRadius: "999px", height: "40px"}} placeholder="Nhập họ tên..."/>
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{span: 24}} //whole column
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        {required: true, message: 'Số điện thoại không được để trống!'},
                        {
                            pattern: /^[0-9]{10,}$/,
                            message: 'Số điện thoại chỉ được chứa số và phải có ít nhất 10 ký tự!'
                        },
                    ]}
                >
                    <Input style={{borderRadius: "999px", height: "40px"}}
                           placeholder="Nhập số điện thoại..."/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateUser;