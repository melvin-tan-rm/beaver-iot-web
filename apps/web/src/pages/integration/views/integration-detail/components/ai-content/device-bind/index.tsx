import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useRequest } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { AddIcon, DeleteOutlineIcon, toast, CodeIcon } from '@milesight/shared/src/components';
import { TablePro, useConfirm } from '@/components';
import { awaitWrap, isRequestSuccess, embeddedNSApi, getResponseData } from '@/services/http';
import { InteEntityType } from '../../../hooks';

interface IProps {
    /** Entity list */
    entities?: InteEntityType[];

    /** Edit successful callback */
    onUpdateSuccess?: () => void;
}

/**
 * device binding component
 */
const DeviceBind: React.FC<IProps> = ({ entities, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();
    const navigate = useNavigate();
    const confirm = useConfirm();
    const [addOpen, setAddOpen] = useState<boolean>(false);

    // ---------- list data related to ----------
    const [keyword, setKeyword] = useState<string>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);

    return <div />;
};

export default DeviceBind;
