import { useI18n } from '@milesight/shared/src/hooks';

import notPermissionImg from './assets/403.svg';

import './style.less';

export default () => {
    const { getIntlText } = useI18n();

    return (
        <div className="ms-view-403">
            <div className="ms-view-403__wrapper">
                <div className="ms-view-403__img">
                    <img src={notPermissionImg} alt="not-permission" />
                </div>
                <div className="ms-view-403__title">403 Forbidden</div>
                <div className="ms-view-403__description">
                    {getIntlText('common.label.page_not_permission')}
                </div>
            </div>
        </div>
    );
};
