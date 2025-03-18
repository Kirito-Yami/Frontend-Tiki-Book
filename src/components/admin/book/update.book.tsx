import {useEffect, useState} from "react";
import {
    App, Col, Form, FormProps, GetProp, Image,
    Input, InputNumber, Modal, Row, Select,
    Upload, UploadFile, UploadProps
} from "antd";
import {getCategoryAPI, updateBookAPI, uploadFileAPI} from "services/api";
import {v4 as uuidv4} from "uuid";
import {MAX_UPLOAD_IMAGE_SIZE} from "services/helper";
import {UploadChangeParam} from "antd/es/upload";
import {UploadRequestOption as RcCustomRequestOptions} from 'rc-upload/lib/interface';
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = "thumbnail" | "slider";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (values: boolean) => void;
    dataUpdateBook: IBookTable | null;
    setDataUpdateBook: (values: IBookTable | null) => void;
    refreshTable: () => void;
}

interface FieldType {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: string;
    slider: string[];
}

interface CustomUploadFile extends UploadFile {
    name: string;
    url: string;
}

const UpdateBook = (props: IProps) => {
    const {dataUpdateBook, setDataUpdateBook, openModalUpdate, setOpenModalUpdate, refreshTable} = props;
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const {message, notification} = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map((item) => {
                    return {
                        value: item,
                        label: item
                    }
                });
                setListCategory(d);
            }
        }
        fetchCategory();
    }, []);

    useEffect(() => {
        if (dataUpdateBook) {
            const arrThumbnail: CustomUploadFile[] = [{
                uid: uuidv4(),
                name: dataUpdateBook.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateBook.thumbnail}`,
            }];
            const arrSlider: CustomUploadFile[] = dataUpdateBook?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            });
            form.setFieldsValue({
                _id: dataUpdateBook._id,
                mainText: dataUpdateBook.mainText,
                author: dataUpdateBook.author,
                price: dataUpdateBook.price,
                quantity: dataUpdateBook.quantity,
                category: dataUpdateBook.category,
                thumbnail: arrThumbnail,
                slider: arrSlider
            })
            setFileListThumbnail(arrThumbnail);
            setFileListSlider(arrSlider);
        }
    }, [dataUpdateBook]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const {_id, mainText, author, price, quantity, category} = values;
        const thumbnail = fileListThumbnail?.[0].name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];
        const res = await updateBookAPI(_id, mainText, author, price, quantity, category, thumbnail, slider);
        if (res && res.data) {
            message.success("Cập nhật sách thành công");
            form.resetFields();
            setFileListThumbnail([]);
            setFileListSlider([]);
            setDataUpdateBook(null);
            setOpenModalUpdate(false);
            refreshTable();
        } else {
            notification.error({
                message: "Cập nhật sách thất bại",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const onClose = () => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setDataUpdateBook(null);
        setOpenModalUpdate(false);
    }

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            if (type === "slider") {
                setLoadingSlider(true);
            } else {
                setLoadingThumbnail(true);
            }
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (type === "slider") {
                setLoadingSlider(false);
            } else {
                setLoadingThumbnail(false);
            }
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const {onSuccess} = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");
        if (res && res.data) {
            const uploadedFile: CustomUploadFile = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{...uploadedFile}]);
            } else {
                setFileListSlider((prevState) => [...prevState, {...uploadedFile}]);
            }
            if (onSuccess) {
                onSuccess("ok");
            } else {
                message.error(res.message);
            }
        }
    };

    const normFile = (event: UploadChangeParam<UploadFile>): UploadFile[] | undefined => {
        if (Array.isArray(event)) {
            return event;
        }
        return event.fileList;
    };

    return (
        <>
            <Modal
                title="Cập nhật sách"
                open={openModalUpdate}
                onOk={() => form.submit()
                }
                onCancel={onClose}
                destroyOnClose={true}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"40vw"}
                maskClosable={false}
            >
                <Form
                    form={form}
                    name="form-update-book"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="ID"
                                name="_id"
                                hidden={true}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Tên sách"
                                name="mainText"
                                rules={[{required: true, message: 'Vui lòng nhập tên sách!'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Tác Giả"
                                name="author"
                                rules={[{required: true, message: 'Vui lòng nhập tên tác giả!'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]}>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Giá Tiền"
                                name="price"
                                rules={[{required: true, message: 'Vui lòng nhập giá tiền!'}]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{width: '100%'}}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter=" đ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Thể Loại"
                                name="category"
                                rules={[{required: true, message: 'Vui lòng chọn thể loại sách!'}]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Số Lượng"
                                name="quantity"
                                rules={[{required: true, message: 'Vui lòng nhập tên tác giả!'}]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{width: '100%'}}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter=" quyển"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                                rules={[{required: true, message: 'Vui lòng upload thumbnail!'}]}
                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined/> : <PlusOutlined/>}
                                        <div style={{marginTop: 8}}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{span: 24}}
                                label="Ảnh Slider"
                                name="slider"
                                rules={[{required: true, message: 'Vui lòng upload slider!'}]}
                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    fileList={fileListSlider}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined/> : <PlusOutlined/>}
                                        <div style={{marginTop: 8}}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                {previewImage && (
                    <Image
                        wrapperStyle={{display: 'none'}}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Modal>
        </>
    )
}

export default UpdateBook;