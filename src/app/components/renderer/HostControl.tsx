"use client"

import { useJsonForms, withJsonFormsControlProps } from '@jsonforms/react';
import { Collapse, Divider, Input, Typography, Select, Table, SelectProps, Button } from 'antd';
const { Option } = Select;
import { Modal } from 'antd';
import { Key, useState } from 'react';


interface Permission {
    GET?: any;
    POST?: any;
    PATCH?: any;
    PUT?: any;
    DELETE?: any;
    OPTIONS?: any;
}

interface ChildNode {
    entity?: string;
    relations?: any[];
    permission?: Permission;
    children?: {
        [key: string]: ChildNode;
    };
}

interface HostValue {
    [key: string]: {
        [key: string]: {
            permission?: Permission;
            children?: {
                [key: string]: ChildNode;
            };
        };
    };
}

interface HostProps {
    id?: string;
    value: HostValue;
    updateValue: (newValue: HostValue) => void;
}

interface HostControlProps {
    data: HostValue;
    handleChange(path: string, value: HostValue): void;
    path: string;
}

const HostControl = ({
    data,
    handleChange,
    path,
}: HostControlProps) => (
    <Host
        value={data}
        updateValue={(newValue: HostValue) => handleChange(path, newValue)}
    />
);



export default withJsonFormsControlProps(HostControl);

const Path = ({ path, value, updateValue, relations }: any) => {

    const isEntityPath = path === "#";

    const handlePermissionChange = (method: string, newPermission: any) => {
        const newValue = { ...value };
        newValue[path].permission[method] = newPermission === "{}" ? {} : newPermission;
        updateValue(newValue);
    };

    const dataSource = Object.keys(value[path]?.permission || {}).map((method) => ({
        key: method,
        value: value[path]?.permission?.[method] || null,
        settings: value[path]?.permission?.[method] === 'Both' ? (
            <div className='flex flex-col items-center gap-2'>
                <Select
                    placeholder="Entity"
                    style={{ width: '75%' }}    
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                </Select>
                <Select
                    placeholder="Permission"
                    style={{ width: '75%' }}
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                </Select>
            </div>
        ) : '', // Replace with actual settings if available
        actions: <Button
            type="text"
            danger
            onClick={() => {
                Modal.confirm({
                    title: 'Delete Permission',
                    content: 'Are you sure you want to delete this permission?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk() {
                        const newValue = { ...value };
                        delete newValue[path].permission[method];
                        updateValue(newValue);
                    },
                })
            }}
        >
            Delete
        </Button>,

    }));

    const columns = [
        {
            title: 'Method',
            dataIndex: 'key',
            key: 'key',
            render: (text: any) => (
                <Input
                    defaultValue={text}
                    onBlur={
                        (e) => {
                            const newValue = { ...value };
                            newValue[path].permission[e.target.value] = newValue[path].permission[text];
                            delete newValue[path].permission[text];
                            updateValue(newValue);
                        }
                    }
                />
            ),
        },
        {
            title: 'Permission',
            dataIndex: 'value',
            key: 'value',
            render: (text: any, record: any) => (
                <Select
                    value={text === null ? null : JSON.stringify(text)}
                    onChange={(value) => handlePermissionChange(record.key, value)}
                    className='w-full'
                >
                    <Option value={null}>Public</Option>
                    <Option value="{}">Only Authentication</Option>
                    <Option value="Both">Both Authentication and Authorization</Option>
                </Select>
            ),
        },
        {
            title: 'Settings',
            dataIndex: 'settings',
            key: 'settings',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
        },
    ];
    
    return (
        <>
            <div className='flex justify-between w-full'>
                <Typography.Text>/{path}</Typography.Text>

                <Button
                    className='w-[128px]'
                    type="default"
                    danger
                    onClick={() => {
                        Modal.confirm({
                            title: 'Delete Path',
                            content: 'Are you sure you want to delete this path? This action cannot be undone.',
                            okText: 'Yes',
                            okType: 'danger',
                            cancelText: 'No',
                            onOk() {
                                const newValue = { ...value };
                                delete newValue[path];
                                updateValue(newValue);
                            },
                        });
                    }}
                >
                    Delete Path
                </Button>
            </div>

            <div className="flex flex-col w-full items-center justify-between">
                <div className='flex w-full items-center gap-4'>
                    <Typography.Text className='nowrap'>Is Entity Path: </Typography.Text>
                    <Input
                        type="checkbox"
                        className='w-1/6'
                        checked={isEntityPath}
                        onChange={(e) => {
                            Modal.confirm({
                                title: 'Change Path Type',
                                content: 'Are you sure you want to change the path type? Current path will be deleted and this action cannot be undone.',
                                okText: 'Yes',
                                okType: 'primary',
                                cancelText: 'No',
                                onOk() {
                                    const newValue = { ...value };
                                    if (e.target.checked) {
                                        newValue["#"] = newValue[path];
                                        delete newValue[path];
                                    } else {
                                        newValue[path] = newValue["#"];
                                        delete newValue["#"];
                                    }

                                    updateValue(newValue);
                                },
                            })
                        }}
                    />
                </div>
                
                <div className='flex w-full items-center justify-between'>
                    <Typography.Text>Path: </Typography.Text>
                    <Input
                        className='w-1/2'
                        disabled={isEntityPath}
                        defaultValue={path}
                        onBlur={(e) => {
                            const newPath = e.target.value.replace(/^\//, '');
                            
                            if (newPath !== path) {
                                if (newPath in value) {
                                    // Show error
                                    Modal.warning({
                                        title: 'Path already exists',
                                        content: 'Please choose a different path',
                                    });
                                    return;
                                }
                                
                                const newValue = { ...value };
                                const entries = Object.entries(newValue);
                                const index = entries.findIndex(([key]) => key === path);
                                
                                if (index !== -1) {
                                    entries[index][0] = newPath;
                                    const orderedValue = Object.fromEntries(entries);
                                    updateValue(orderedValue);
                                }
                            }
                        }}
                        
                    />
                </div>
                
                <div className='flex w-full items-center justify-between'>
                    <Typography.Text>Relations: </Typography.Text>
                    {/* Relations */}
                    <Select 
                        mode="multiple"
                        style={{ width: '50%' }}
                        placeholder="Select relations"
                        value={value[path].relations || []}
                        onChange={(selectedRelations) => {
                            const newValue = { ...value };
                            newValue[path].relations = selectedRelations;
                            updateValue(newValue);
                        }}
                    >  
                        {relations.map((relation: string, index: Key | null | undefined) => (
                            <Option key={index} value={relation}>{relation}</Option>
                        ))}
                    </Select>
                </div>
                
                <Typography.Text className='self-start'>Permissions / Access Control</Typography.Text>
                
                <Table
                    className='w-full'
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />

                <Button 
                    type="dashed"
                    className='w-full'
                    onClick={() => {
                        const newValue = { ...value };
                        newValue[path].permission = {
                            ...newValue[path].permission,
                            "method": {}
                        };
                        updateValue(newValue);
                    }}
                >Add More Permissions</Button>
            </div>
            <Divider />

            
        </>

    );

}

// Ensure value[host] is defined before accessing its keys
const renderPaths = (host: string, value: HostValue, updateValue: (newValue: HostValue) => void, relations: string[]) => {
    if (!value[host]) {
        return null; // or handle the case where value[host] is undefined
    }

    return Object.keys(value[host]).map((path, index) => (
        <>
            <Path key={index} path={path} value={value[host]} updateValue={(newValue: any) => {
            const updatedValue = { ...value, [host]: newValue };
            updateValue(updatedValue);
            }}
            relations={relations}
            />
            <Button
            type="dashed"
            className="mt-2"
            onClick={() => {
                const newValue = { ...value };
                if (!newValue[host][path].children) {
                newValue[host][path].children = {};
                }
                newValue[host][path].children["untitled"] = {};
                updateValue(newValue);
            }}
            >
            Add Child Path
            </Button>
            <Divider />
        </>
    ));
};

function Host({ id, value, updateValue }: HostProps) {
    const ctx = useJsonForms()
    
    const relations = Object.keys(ctx.core?.data?.authorization || {});

    return (
    <Collapse defaultActiveKey={['1']} className="text-sm">
        {Object.keys(value).map((host, index) => (
            <Collapse.Panel header={host} key={host+index}>
                <div className="flex flex-col p-4">
                    {renderPaths(host, value, updateValue, relations)}
                    <Button
                        type="dashed"
                        onClick={() => {
                            const newValue = { ...value };
                            newValue[host] = {
                                ...newValue[host],
                                "untitled": {}
                            };
                            updateValue(newValue);
                        }}
                    >
                        Add Root Paths
                    </Button>
                </div>
            </Collapse.Panel>
        ))}
    </Collapse>
  );
}