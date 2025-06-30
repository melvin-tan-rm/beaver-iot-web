import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash-es';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { useConfirm } from '@/components';
import { tagAPI, awaitWrap, isRequestSuccess } from '@/services/http';
import { type TableRowDataType } from './useColumns';

export default function useTag(getAllTags?: () => void) {
    const { getIntlText } = useI18n();
    const confirm = useConfirm();

    const handleDeleteTag = useMemoizedFn((records: TableRowDataType[]) => {
        if (!Array.isArray(records) || isEmpty(records)) {
            return;
        }

        const isBatch = records.length > 1;
        const titleKey = isBatch ? 'common.label.bulk_deletion' : 'common.label.deletion';
        const description = isBatch
            ? getIntlText('tag.tip.bulk_delete_tag', {
                  1: records.length,
              })
            : getIntlText('tag.tip.single_delete_tag', {
                  1: records?.[0]?.name || '',
              });

        confirm({
            title: getIntlText(titleKey),
            description,
            confirmButtonText: getIntlText('common.label.delete'),
            confirmButtonProps: {
                color: 'error',
            },
            onConfirm: async () => {
                console.log('delete ? ', records);

                getAllTags?.();
                toast.success(getIntlText('common.message.delete_success'));
            },
        });
    });

    return {
        /**
         * To delete tag
         */
        handleDeleteTag,
    };
}
