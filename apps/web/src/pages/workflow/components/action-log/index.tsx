import React, { useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { Alert } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { Tooltip } from '@/components';
import { AccordionCard, AccordionHeader, AccordionTree, ActionCodeEditor } from './components';
import { useNestedData } from './hooks';
import type { ActionLogProps, WorkflowNestNode } from './types';
import './style.less';

function safeJsonParse(str: string) {
    try {
        const result = JSON.parse(str);
        return JSON.stringify(result, null, 2);
    } catch (e) {
        return str;
    }
}
export default React.memo(({ traceData, workflowData, logType }: ActionLogProps) => {
    const { getIntlText } = useI18n();
    const { roots } = useNestedData({ workflowData, traceData, logType });

    const renderTreeData = useMemo(() => {
        return (roots || []).map(data => {
            const { attrs } = data || {};
            const { input, output } = attrs || {};

            return {
                ...(data || {}),
                attrs: {
                    ...attrs,
                    input: safeJsonParse(input!),
                    output: safeJsonParse(output!),
                },
            };
        });
    }, [roots]);

    /** recursive rendering */
    const renderAccordion = (treeData: WorkflowNestNode, title?: string) => {
        const { children, attrs } = treeData || {};
        const { input, output, errorMessage } = attrs || {};

        return (
            <Fragment>
                <AccordionCard header={<AccordionHeader data={attrs} />}>
                    {errorMessage && (
                        <div className="ms-action-log__alert">
                            <Alert severity="error" icon={false}>
                                <Tooltip autoEllipsis title={errorMessage} />
                            </Alert>
                        </div>
                    )}
                    {input && (
                        <div className="ms-action-log__input">
                            <ActionCodeEditor
                                value={input}
                                title={getIntlText('common.label.input')}
                            />
                        </div>
                    )}
                    {output && (
                        <div className="ms-action-log__output">
                            <ActionCodeEditor
                                value={output}
                                title={getIntlText('common.label.output')}
                            />
                        </div>
                    )}
                </AccordionCard>
                {!!children?.length &&
                    (children.length === 1
                        ? renderAccordion(children[0], title)
                        : children.map((child, index) => {
                              const parentTitle = title ? `${title}-${index + 1}` : `${index + 1}`;

                              return (
                                  <AccordionTree
                                      header={getIntlText('workflow.label.branch', {
                                          1: `-${parentTitle}`,
                                      })}
                                      key={child?.attrs?.$$token}
                                  >
                                      {renderAccordion(child, parentTitle)}
                                  </AccordionTree>
                              );
                          }))}
            </Fragment>
        );
    };

    return (
        <div className="ms-action-log">{renderTreeData.map(child => renderAccordion(child))}</div>
    );
});
