import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    FormProps,
    InputNumber,
    Pagination,
    Rate,
    Row,
    Tabs,
    TabsProps
} from "antd";
import 'styles/home.scss'
import {FilterTwoTone, ReloadOutlined} from "@ant-design/icons";

interface FieldType {
    fullName: string;
    password: string;
    email: string;
    phone: number;
}

const HomePage = () => {
    const [form] = Form.useForm();
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: "Phổ biến",
            children: <></>
        },
        {
            key: '2',
            label: "Sách mới",
            children: <></>
        },
        {
            key: '3',
            label: "Thấp -> Cao",
            children: <></>
        },
        {
            key: '4',
            label: "Cao -> Thấp",
            children: <></>
        },
    ];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    }

    const handleChangeFilter = (changedValues, values) => {

    }

    const onChange = (key: string) => {
        console.log(key);
    }
    return (
        <div className="homepage" style={{maxWidth: 1440, margin: "15px auto"}}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                         <span>
                             <FilterTwoTone/> Bộ Lọc Tìm Kiếm
                         </span>
                        <ReloadOutlined title="Reset" onClick={() => form.resetFields()}/>
                    </div>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                    >
                        <Form.Item
                            name="category"
                            label="Danh sách sản phầm"
                            labelCol={{span: 24}}
                        >
                            <Checkbox.Group>
                                <Row>
                                    <Col span={24}>
                                        <Checkbox value="A">
                                            A
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="B">
                                            B
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="C">
                                            C
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="D">
                                            D
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="E">
                                            E
                                        </Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="F">
                                            F
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider/>
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{span: 24}}
                        >
                            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 20}}>
                                <Form.Item name={["range", "from"]}>
                                    <InputNumber
                                        name="from"
                                        min={0}
                                        placeholder={"đ Từ"}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span>-</span>
                                <Form.Item name={["range", "to"]}>
                                    <InputNumber
                                        name="to"
                                        min={0}
                                        placeholder={"đ Đến"}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button
                                    onClick={() => form.submit()}
                                    type="primary"
                                    style={{width: '100%'}}
                                >
                                    Áp dụng
                                </Button>
                            </div>
                        </Form.Item>
                        <Divider/>
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{span: 24}}
                        >
                            <div>
                                <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 15}}/>
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={4} disabled style={{color: "#ffce3d", fontSize: 15}}/>
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={3} disabled style={{color: "#ffce3d", fontSize: 15}}/>
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={2} disabled style={{color: "#ffce3d", fontSize: 15}}/>
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={1} disabled style={{color: "#ffce3d", fontSize: 15}}/>
                                <span className="ant-rate-text"></span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} xs={24}>
                    <Row>
                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            onChange={onChange}
                        />
                    </Row>
                    <Row className='customize-row'>
                        <div className='column'>
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                         alt="thumbnail book"/>
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 10}}/>
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className='column'>
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                         alt="thumbnail book"/>
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 10}}/>
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className='column'>
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                         alt="thumbnail book"/>
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 10}}/>
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className='column'>
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                         alt="thumbnail book"/>
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 10}}/>
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className='column'>
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                         alt="thumbnail book"/>
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 10}}/>
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                        <div className='column'>
                            <div className='wrapper'>
                                <div className='thumbnail'>
                                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                         alt="thumbnail book"/>
                                </div>
                                <div className='text'>
                                    Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(70000)}
                                </div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{color: "#ffce3d", fontSize: 10}}/>
                                    <span>Đã bán 1k</span>
                                </div>
                            </div>
                        </div>
                    </Row>
                    <Divider/>
                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Pagination
                            defaultCurrent={6}
                            total={500}
                            responsive
                        />
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HomePage;