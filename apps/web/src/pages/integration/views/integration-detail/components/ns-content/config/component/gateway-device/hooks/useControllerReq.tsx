import { useCallback, useRef } from 'react';
import { AxiosRequestConfig } from 'axios';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import useAbortController from './useAbortController';

/**
 * Control the hook that terminates a new request if the old one has not been completed
 */
export default function useControllerReq() {
    const { isPending, startRequest, finishRequest } = useAbortController();
    const dataRef = useRef<any>();

    /**
     * The exported request function that can be called externally
     * @param request {Promise}
     * @returns {Promise}
     */
    const getList = async (request: (reqOptions: Partial<AxiosRequestConfig>) => Promise<any>) => {
        const signal = startRequest();
        if (!signal) {
            return;
        }
        try {
            dataRef.current = [];
            const [error, resp] = await awaitWrap(request({ signal }));
            const data = getResponseData(resp);
            if (error || !data || !isRequestSuccess(resp)) {
                return;
            }
            dataRef.current = objectToCamelCase(data);
        } finally {
            finishRequest();
        }
    };

    const resetList = useCallback(() => {
        dataRef.current = [];
    }, []);

    return {
        getList,
        resetList,
        loading: isPending,
        data: dataRef.current,
    };
}
