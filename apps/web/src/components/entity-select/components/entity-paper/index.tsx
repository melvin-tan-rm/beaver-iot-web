import React, { useCallback, useContext } from 'react';
import { Paper, PaperProps, Tab, Tabs } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { EntityContext } from '../../context';
import { TabOptions } from '../../constant';
import type { TabType } from '../../types';

export default React.memo(({ children, ...props }: PaperProps) => {
    const { tabType, setTabType } = useContext(EntityContext);
    const { getIntlText } = useI18n();

    /** handle tab change */
    const handleTabChange = useCallback(
        (_event: React.SyntheticEvent, value: TabType) => {
            setTabType(value);
        },
        [setTabType],
    );
    /** when tab change, prevent default behavior */
    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
    }, []);
    return (
        <div>
            <Paper {...props}>
                <Tabs
                    value={tabType}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    onMouseDown={handleMouseDown}
                >
                    {TabOptions.map(({ label, value }) => (
                        <Tab label={getIntlText(label)} value={value} key={value} />
                    ))}
                </Tabs>
                {children}
            </Paper>
        </div>
    );
});
