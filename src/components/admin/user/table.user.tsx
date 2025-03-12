import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button} from 'antd';
import {useRef} from 'react'
import {getUsersAPI} from "services/api.ts";

const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'ID',
        dataIndex: '_id',
        ellipsis: true,
    },
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        // copyable: true,
        ellipsis: true,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        // copyable: true,
        ellipsis: true,
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        // copyable: true,
        ellipsis: true,
    },
    {
        title: 'Role',
        dataIndex: 'role',
        // copyable: true,
        ellipsis: true,
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        // copyable: true,
        ellipsis: true,
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        // copyable: true,
        ellipsis: true,
    },
];

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async ( sort, filter) => {
                    console.log(sort, filter);
                    const res = await getUsersAPI();
                    return {
                        data: res.data?.result,
                        "page": 1,
                        "success": true,
                        "total": res.data?.meta.total
                    }
                }}
                rowKey="id"
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                pagination={{
                    pageSize: 5,
                    onChange: (page) => console.log(page),
                }}
                dateFormatter="string"
                headerTitle="Table User"
                editable={{
                    type: 'multiple',
                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            actionRef.current?.reload();
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
        </>
    );
};

export default TableUser;