import { useRequest } from 'ahooks';
import { useStoreShallow } from '@milesight/shared/src/hooks';
import { credentialsApi, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import useFlowStore from '../store';

const useCredential = () => {
    const { mqttCredentials, httpCredentials, setMqttCredentials, setHttpCredentials } =
        useFlowStore(
            useStoreShallow([
                'mqttCredentials',
                'httpCredentials',
                'setMqttCredentials',
                'setHttpCredentials',
            ]),
        );

    // Get MQTT credentials and broker info
    const { loading: mqttCredentialsLoading } = useRequest(
        async () => {
            const [err, resp] = await awaitWrap(
                Promise.all([
                    credentialsApi.getMqttCredential(),
                    credentialsApi.getMqttBrokerInfo(),
                ]),
            );
            const [basicResp, brokerResp] = resp || [];

            if (err || !isRequestSuccess(basicResp) || !isRequestSuccess(brokerResp)) {
                return;
            }
            const basicInfo = getResponseData(basicResp);
            const brokerInfo = getResponseData(brokerResp);
            const result =
                basicInfo && brokerInfo
                    ? {
                          ...basicInfo,
                          ...brokerInfo,
                      }
                    : null;

            setMqttCredentials(result);
        },
        {
            debounceWait: 300,
        },
    );

    const { loading: httpCredentialsLoading } = useRequest(
        async () => {
            const [err, resp] = await awaitWrap(
                credentialsApi.getDefaultCredential({ credentialsType: 'HTTP' }),
            );

            if (err) return;
            const result = getResponseData(resp);
            setHttpCredentials(result);
        },
        {
            debounceWait: 300,
        },
    );

    return {
        mqttCredentials,
        mqttCredentialsLoading,

        httpCredentials,
        httpCredentialsLoading,
    };
};

export default useCredential;
