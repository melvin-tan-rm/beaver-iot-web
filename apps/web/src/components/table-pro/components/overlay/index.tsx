import React from 'react';
import { styled } from '@mui/material/styles';
import type { GridSlots, PropsFromSlot } from '@mui/x-data-grid';
import { useI18n } from '@milesight/shared/src/hooks';
import Empty from '@/components/empty';

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-data-primary': {
        fill: '#3D4751',
        ...theme.applyStyles('light', {
            fill: '#AEB8C2',
        }),
    },
    '& .no-data-secondary': {
        fill: '#1D2126',
        ...theme.applyStyles('light', {
            fill: '#E8EAED',
        }),
    },
}));

interface NoDataOverlayProps extends PropsFromSlot<GridSlots['noRowsOverlay']> {
    /** 提示文案 */
    content?: React.ReactNode;
}

interface NoResultsOverlayProps extends PropsFromSlot<GridSlots['noResultsOverlay']> {
    /** 提示文案 */
    content?: React.ReactNode;
}

/**
 * Table 空数据占位
 */
const NoDataOverlay: React.FC<NoDataOverlayProps> = React.memo(({ content }) => {
    const { getIntlText } = useI18n();

    return (
        <StyledGridOverlay>
            <Empty text={content || getIntlText('common.label.empty')} />
        </StyledGridOverlay>
    );
});

/**
 * Table 筛选无数据占位
 */
const NoResultsOverlay: React.FC<NoResultsOverlayProps> = React.memo(({ content }) => {
    const { getIntlText } = useI18n();

    return (
        <StyledGridOverlay>
            <Empty text={content || getIntlText('common.message.no_results_found')} />
        </StyledGridOverlay>
    );
});

export { NoDataOverlay, NoResultsOverlay };
export default NoDataOverlay;
