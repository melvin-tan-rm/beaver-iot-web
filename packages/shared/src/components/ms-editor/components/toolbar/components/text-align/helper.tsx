import { $isElementNode, ElementFormatType, ElementNode, LexicalNode } from 'lexical';
import { $findMatchingParent } from '@lexical/utils';
import { ELEMENT_TYPE_TO_FORMAT } from './constant';

/** 判断是否包含位置信息 */
export const hasAlignFormat = (node: LexicalNode, type: Exclude<ElementFormatType, ''>) => {
    const element = $findMatchingParent(
        node,
        (parentNode): parentNode is ElementNode =>
            $isElementNode(parentNode) && !parentNode.isInline(),
    );
    if (element === null) return false;

    return element.getFormat() === ELEMENT_TYPE_TO_FORMAT[type];
};
