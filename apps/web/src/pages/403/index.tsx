import { useI18n } from '@milesight/shared/src/hooks';

import { Empty } from '@/components';

import './style.less';

export default () => {
    const { getIntlText } = useI18n();

    return (
        <div className="ms-view-403">
            <Empty type="nodata" text={getIntlText('common.label.page_not_permission')} />
        </div>
    );
};
