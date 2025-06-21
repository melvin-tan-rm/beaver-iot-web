import React, { useState, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { TablePro, type ColumnType } from '@/components';
import {
    aiApi,
    entityAPI,
    awaitWrap,
    isRequestSuccess,
    getResponseData,
    type AiAPISchema,
} from '@/services/http';
import CodePreview from '../code-preview';
import ImagePreview from '../image-preview';
import './style.less';

interface Props extends ModalProps {
    /** Target device detail */
    device?: AiAPISchema['getBoundDevices']['response']['content'][0] | null;
}

type TableRowDataType = Record<string, any>;

const LogModal: React.FC<Props> = ({ device, ...props }) => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();

    // ---------- Render Table ----------
    const historyKey = device?.infer_history_key;
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const columns: ColumnType<TableRowDataType>[] = useMemo(
        () => [
            {
                field: 'originalImageUrl',
                headerName: 'Original Image',
                minWidth: 120,
                cellClassName: 'd-flex align-items-center',
                renderCell({ id, value }) {
                    return <ImagePreview key={id} src={value} />;
                },
            },
            {
                field: 'modelName',
                headerName: 'Model Name',
                minWidth: 160,
                ellipsis: true,
            },
            {
                field: 'createdAt',
                headerName: getIntlText('common.label.create_time'),
                flex: 1,
                minWidth: 150,
                ellipsis: true,
                renderCell({ value }) {
                    return getTimeFormat(value);
                },
            },
            {
                field: 'inferenceAt',
                headerName: 'Inference Time',
                ellipsis: true,
                flex: 1,
                minWidth: 150,
                renderCell({ value }) {
                    return getTimeFormat(value);
                },
            },
            {
                field: 'resultImageUrl',
                headerName: 'Result Image',
                minWidth: 120,
                cellClassName: 'd-flex align-items-center',
                renderCell({ id, value }) {
                    return <ImagePreview key={id} src={value} />;
                },
            },
            {
                field: 'inferenceResult',
                headerName: 'Inference Result',
                minWidth: 160,
                cellClassName: 'd-flex align-items-center',
                renderCell({ id, value }) {
                    return <CodePreview key={id} content={value} />;
                },
            },
            {
                field: 'status',
                headerName: 'Status',
                minWidth: 160,
                ellipsis: true,
            },
        ],
        [getIntlText, getTimeFormat],
    );

    const {
        loading,
        run: getHistory,
        data: logList,
    } = useRequest(
        async () => {
            if (!historyKey) return;
            const [err, resp] = await awaitWrap(entityAPI.getHistory({ entity_id: historyKey }));

            if (err || !isRequestSuccess(resp)) return;
            const data = getResponseData(resp);

            console.log({ data, resp });
            return [
                {
                    id: '123',
                    modelName: 'Test Model 1',
                    originalImageUrl:
                        'http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg',
                    resultImageUrl:
                        'http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg',
                    inferenceResult: '1231',
                    status: 'normal',
                    createdAt: Date.now(),
                    inferenceAt: Date.now(),
                },
            ];
        },
        {
            debounceWait: 300,
            refreshDeps: [historyKey],
        },
    );

    return (
        <Modal
            {...props}
            showCloseIcon
            width="1200px"
            className="ms-com-log-modal"
            title={getIntlText('common.label.log')}
        >
            <TablePro<TableRowDataType>
                loading={loading}
                columns={columns}
                rows={logList || []}
                rowCount={logList?.length || 0}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
            />
        </Modal>
    );
};

export default LogModal;
