import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { setFileListResult } from "../store/slices/g_fileListResult";

const { Dragger } = Upload;

const DraggerUpload = () => {
    const g_fileListResult = useSelector((state) => state.g_fileListResult);
    const dispatch = useDispatch();

    const dummyRequest = async ({ file, onSuccess }) => {    
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const props = {
        name: 'file',
        multiple: false, // [TODO]
        // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        customRequest: dummyRequest,
        onChange(info) {
            const { uid, status, originFileObj} = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let tmpObj = Object.assign({}, g_fileListResult);
                    tmpObj[uid] = e.target.result;
                    dispatch(setFileListResult(tmpObj));
                };
                reader.readAsText(originFileObj);
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'removed') {
                let tmpObj = Object.assign({}, g_fileListResult);
                delete tmpObj[uid];
                dispatch(setFileListResult(tmpObj));
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <div>
            <Dragger {...props}>
                <p className="ant-upload-text">Click or drag file to this area to upload: </p>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
            </Dragger>
        </div>
    );
};

export default DraggerUpload;