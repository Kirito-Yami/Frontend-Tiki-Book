import {App, Avatar, Button, Col, Form, FormProps, Input, Row, Upload, UploadFile} from "antd";
import {useCurrentApp} from "components/context/app.context.tsx";
import {useEffect, useState} from "react";
import {UploadRequestOption as RcCustomRequestOptions} from 'rc-upload/lib/interface';
import {updateUserInfoAPI, uploadFileAPI} from "services/api.ts";
import {UploadChangeParam} from "antd/es/upload";
import {AntDesignOutlined, UploadOutlined} from "@ant-design/icons";

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: number;
};

const UserInfo = () => {
    const [form] = Form.useForm();
    const {message, notification} = App.useApp();
    const {user, setUser} = useCurrentApp();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user.id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
            })
        }
    }, [user]);

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const {onSuccess} = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "avatar");
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            setUserAvatar(newAvatar);
            if (onSuccess) {
                onSuccess('ok');
            }
        } else {
            message.error(res.message);
        }
    }

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') { /* empty */
            }
            if (info.file.status === 'done') {
                message.success(`Upload file thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload file thất bại`);
            }
        },
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {fullName, phone, _id} = values;
        setIsSubmit(true)
        const res = await updateUserInfoAPI(_id, fullName, phone, userAvatar);
        if (res && res.data) {
            //update react context
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone
            })
            message.success("Cập nhật thông tin user thành công");
            //force renew token
            localStorage.removeItem('access_token');
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    return (
        <div style={{minHeight: 400}}>
            <Row>
                <Col sm={24} md={12}>
                    <Row gutter={[30, 30]}>
                        <Col span={24}>
                            <Avatar
                                size={{xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200}}
                                icon={<AntDesignOutlined/>}
                                src={urlAvatar}
                                shape="circle"
                            />
                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined/>}>
                                    Upload Avatar
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={12}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        name="user-info"
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            hidden
                            labelCol={{span: 24}}
                            label="_id"
                            name="_id"
                        >
                            <Input disabled hidden/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{span: 24}}
                            label="Email"
                            name="email"
                            rules={[
                                {required: true, message: 'Email không được để trống!'},
                                {type: "email", message: "Email không đúng định dạng!"}
                            ]}
                        >
                            <Input disabled style={{borderRadius: "5px", height: "40px"}} placeholder="Nhập email..."/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{span: 24}}
                            label="Tên hiển thị"
                            name="fullName"
                            rules={[{required: true, message: 'Tên hiển thị không được để trống!'}]}
                        >
                            <Input style={{borderRadius: "5px", height: "40px"}} placeholder="Nhập tên hiển thị..."/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{span: 24}}
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {required: true, message: 'Số điện thoại không được để trống!'},
                                {
                                    pattern: /^[0-9]{9,}$/,
                                    message: 'Số điện thoại chỉ được chứa số và phải có ít nhất 9 ký tự!'
                                },
                            ]}
                        >
                            <Input style={{borderRadius: "5px", height: "40px"}} placeholder="Nhập số điện thoại..."/>
                        </Form.Item>
                        <Button loading={isSubmit} onClick={() => form.submit()}>Cập nhật</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserInfo;