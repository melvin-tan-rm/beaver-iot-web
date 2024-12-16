import { useState } from 'react';

/**
 * transfer data hooks
 */
const useTransfer = () => {
    const [checked, setChecked] = useState<ApiKey[]>([]);

    return {
        checked,
        setChecked,
    };
};

export default useTransfer;
