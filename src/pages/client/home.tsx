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
    Row, Spin,
    Tabs,
    TabsProps
} from "antd";
import 'styles/home.scss'
import {FilterTwoTone, ReloadOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {getBooksAPI, getCategoryAPI} from "services/api.ts";

interface FieldType {
    fullName: string;
    password: string;
    email: string;
    phone: number;
}

const HomePage = () => {
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [listBook, setListBook] = useState<IBookTable[]>([]);

    const [current, setCurrent] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(5);

    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [filter, setFilter] = useState<string>('');

    const [sortQuery, setSortQuery] = useState<string>('sort=-sold');

    const [form] = Form.useForm();

    useEffect(() => {
        const initCategory = async () => {
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
        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log("Check: ", changedValues, values);
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    }

    const onChange = (key: string) => {
        console.log(key);
    }

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

    return (
        <div style={{background: "#efefef", padding: "20px 0"}}>
            <div className="homepage" style={{maxWidth: 1440, margin: "0px auto"}}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{padding: "20px", background: "#fff", borderRadius: 5}}>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <span>
                                    <FilterTwoTone/>
                                    <span style={{fontWeight: 500, paddingLeft: "10px"}}>Bộ Lọc Tìm Kiếm</span>
                                </span>
                                <ReloadOutlined title="Reset" onClick={() => form.resetFields()}/>
                            </div>
                            <Divider/>
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
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{padding: "7px 0"}}>
                                                        <Checkbox value={item.value}>
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider/>
                                <Form.Item
                                    label="Khoảng giá"
                                    labelCol={{span: 24}}
                                >
                                    <Row gutter={[10, 10]} style={{width: "100%"}}>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'from']}>
                                                <InputNumber
                                                    name="from"
                                                    min={0}
                                                    placeholder="đ Từ"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    style={{width: '100%'}}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={2} md={24}>
                                            <div> -</div>
                                        </Col>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'to']}>
                                                <InputNumber
                                                    name="to"
                                                    min={0}
                                                    placeholder="đ Đến"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    style={{width: '100%'}}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
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
                        </div>
                    </Col>

                    <Col md={20} xs={24}>
                        <Spin spinning={isLoading} tip="Loading...">
                            <div style={{padding: "20px", background: "#fff", borderRadius: 5}}>
                                <Row>
                                    <Tabs
                                        defaultActiveKey="sort=-sold"
                                        items={items}
                                        onChange={(values) => {
                                            setSortQuery(values)
                                        }}
                                        style={{overflow: "auto"}}
                                    />
                                </Row>
                                <Row className="customize-row">
                                    {listBook?.map((item, index) => {
                                        return (
                                            <div className="column" key={`book-${index}`}>
                                                <div className="wrapper">
                                                    <div className="thumbnail">
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                                            alt="Thumbnail Book"
                                                        />
                                                    </div>
                                                    <div className="text" title={item.mainText}>
                                                        {item.mainText}
                                                    </div>
                                                    <div className="price">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: "currency",
                                                            currency: "VND"
                                                        }).format(item?.price ?? 0)}
                                                    </div>
                                                    <div className="rating">
                                                        <Rate
                                                            value={5}
                                                            disabled
                                                            style={{color: "#ffce3d", fontSize: 10}}
                                                        />
                                                        <span>Đã bán {item?.sold ?? 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Row>
                                <div style={{marginTop: "30px"}}></div>
                                <Row style={{display: "flex", justifyContent: "center"}}>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={(p, s) => handleOnChangePage({current: p, pageSize: s})}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default HomePage;