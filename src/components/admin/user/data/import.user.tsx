import {App, Modal, Table, Upload, UploadProps} from "antd";
import {InboxOutlined} from "@ant-design/icons";

interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (value: boolean) => void;
}

const {Dragger} = Upload;

const ImportUser = (props: IProps) => {
    const {openModalImport, setOpenModalImport} = props;
    const {message} = App.useApp();

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: true,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest: ({ onSuccess }) => {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 0);
        },
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const onClose = () => {
        setOpenModalImport(false);
    }

    return (
        <Modal
            title="Import data user"
            open={openModalImport}
            onOk={() => setOpenModalImport(false)}
            okButtonProps={{disabled: true}}
            okText={"Import"}
            onCancel={onClose}
            width={"50vw"}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv, .xls, .xlsx file.
                </p>
            </Dragger>
            <div style={{marginTop: "20px"}}>
                <Table
                    title={() => <span>Dữ liệu upload:</span>}
                    columns={[
                        {dataIndex: 'fullName', title:'Tên Hiển Thị'},
                        {dataIndex: 'email', title:'Email'},
                        {dataIndex: 'phone', title:'Số Điện Thoại'}
                    ]}
                />
            </div>
        </Modal>
    )
}
export default ImportUser;