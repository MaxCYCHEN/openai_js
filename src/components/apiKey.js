import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Input } from 'antd';

import { setOpenApiKey } from "../store/slices/g_openApiKey";

const ApiKey = () => {
    const g_openApiKey = useSelector((state) => state.g_openApiKey);
    const dispatch = useDispatch();

    return (
        <div>
            <p>Your API Key: </p>
            <Input
                value={g_openApiKey}
                onChange={ e => {
                    dispatch(setOpenApiKey(e.target.value))
                }}
            >
            </Input>
        </div>
    );
};

export default ApiKey;