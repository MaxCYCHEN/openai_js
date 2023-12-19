import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Input } from 'antd';

import { setQuestion } from '../store/slices/g_question';

const Question = () => {
    const g_question = useSelector((state) => state.g_question);
    const dispatch = useDispatch();

    return (
        <div>
            <p>User Question: </p>
            <Input.TextArea
                rows={3}
                placeholder="Input Your Question"
                value={g_question}
                onChange={ e => {
                    dispatch(setQuestion(e.target.value))
                }}
            />
        </div>
    );
};

export default Question;