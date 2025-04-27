import React, { useState, useEffect, useCallback } from 'react';
import { Panel, useNodes, useReactFlow, useViewport } from '@xyflow/react';
import { Stack, Paper, ButtonGroup, Button, Tooltip } from '@mui/material';
import cls from 'classnames';
import { useI18n } from '@milesight/shared/src/hooks';
import {
    ZoomInIcon,
    ZoomOutIcon,
    MyLocationIcon,
    // AddCircleIcon,
    AddCircleOutlineIcon,
    PointerIcon,
    BackHandOutlinedIcon,
} from '@milesight/shared/src/components';
import NodeMenu from '../node-menu';
import { MAX_PRETTY_ZOOM } from '../../constants';
import type { MoveMode } from '../../typings';
import './style.less';

export interface ControlsProps {
    /**
     * Minimum zoom
     */
    minZoom?: number;

    /**
     * Maximum zoom
     */
    maxZoom?: number;

    /**
     * Whether disable add button
     */
    addable?: boolean;

    /**
     * Current edit mode
     */
    moveMode: MoveMode;

    /**
     * Move mode change callback
     */
    onMoveModeChange: (mode: MoveMode) => void;
}

/**
 * Workflow Editor Controls
 */
const Controls: React.FC<ControlsProps> = ({
    minZoom,
    maxZoom,
    addable = true,
    moveMode,
    onMoveModeChange,
}) => {
    const nodes = useNodes();
    const { zoom } = useViewport();
    const { zoomIn, zoomOut, fitView, getNodes, setNodes, getEdges, setEdges } = useReactFlow<
        WorkflowNode,
        WorkflowEdge
    >();
    const { getIntlHtml } = useI18n();

    // ---------- Add Button Click Callback ----------
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(e.currentTarget);
        e.stopPropagation();
    }, []);

    // ---------- Move Mode Change ----------
    const isPanMode = moveMode === 'hand';
    const handleMoveModeChange = useCallback(
        (mode: MoveMode) => {
            onMoveModeChange(mode);

            if (mode === 'pointer') return;
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map(node => ({
                ...node,
                selected: false,
            }));
            const newEdges = edges.map(edge => ({
                ...edge,
                selected: false,
            }));

            setNodes(newNodes);
            setEdges(newEdges);
        },
        [getNodes, setNodes, getEdges, setEdges, onMoveModeChange],
    );

    useEffect(() => {
        const handleKeypress = (e: KeyboardEvent) => {
            if (!e.ctrlKey) return;
            switch (e.key) {
                case 'v': {
                    handleMoveModeChange('pointer');
                    break;
                }
                case 'h': {
                    handleMoveModeChange('hand');
                    break;
                }
                default: {
                    break;
                }
            }
        };

        window.addEventListener('keypress', handleKeypress);
        return () => {
            window.removeEventListener('keypress', handleKeypress);
        };
    }, [handleMoveModeChange]);

    return (
        <Panel
            position="bottom-left"
            className={cls('ms-workflow-controls-root', { hidden: !nodes.length })}
        >
            <Stack direction="row" spacing={1}>
                <Paper elevation={0}>
                    <ButtonGroup variant="text">
                        <Button disabled={!!minZoom && minZoom === zoom} onClick={() => zoomOut()}>
                            <ZoomOutIcon sx={{ fontSize: 20 }} />
                        </Button>
                        <Button disabled={!!maxZoom && maxZoom === zoom} onClick={() => zoomIn()}>
                            <ZoomInIcon sx={{ fontSize: 20 }} />
                        </Button>
                        <Button
                            onClick={() => fitView({ maxZoom: MAX_PRETTY_ZOOM, duration: 300 })}
                        >
                            <MyLocationIcon sx={{ fontSize: 20 }} />
                        </Button>
                    </ButtonGroup>
                </Paper>
                <Paper elevation={0}>
                    <ButtonGroup variant="text">
                        <Button
                            className="btn-add"
                            disabled={!addable}
                            sx={{ minWidth: 'auto' }}
                            onClick={handleClick}
                        >
                            <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
                        </Button>
                        <Tooltip
                            enterDelay={300}
                            enterNextDelay={300}
                            slotProps={{
                                popper: { className: 'ms-workflow-controls-tooltip-popper' },
                            }}
                            title={getIntlHtml('workflow.editor.move_mode_pointer')}
                        >
                            <Button
                                className={cls({ active: !isPanMode })}
                                onClick={() => handleMoveModeChange('pointer')}
                            >
                                <PointerIcon sx={{ fontSize: 18 }} />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            enterDelay={300}
                            enterNextDelay={300}
                            slotProps={{
                                popper: { className: 'ms-workflow-controls-tooltip-popper' },
                            }}
                            title={getIntlHtml('workflow.editor.move_mode_hand')}
                        >
                            <Button
                                className={cls({ active: isPanMode })}
                                onClick={() => handleMoveModeChange('hand')}
                            >
                                <BackHandOutlinedIcon sx={{ fontSize: 18 }} />
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                    <NodeMenu
                        anchorOrigin={{
                            vertical: -8,
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                    />
                </Paper>
            </Stack>
        </Panel>
    );
};

export default React.memo(Controls);
