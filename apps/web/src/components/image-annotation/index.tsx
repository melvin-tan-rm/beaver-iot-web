import React, { useState, useEffect, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { isNil } from 'lodash-es';
import { Stage, Layer, Image, Line, Transformer } from 'react-konva';
import { yellow, white, black } from '@milesight/shared/src/services/theme';
import type { Vector2d } from 'konva/lib/types';
import EditableText from './editable-text';

interface PolygonAnnotationProps {
    imgSrc: string;
    points: Vector2d[][];
    scale?: number;
    strokeColor?: string | string[];
    anchorFillColor?: string;
    onPointsChange?: (newPoints: Vector2d[][]) => void;
}

const POLYGON_NAME_PREFIX = 'ms-polygon';
const getPolygonId = (index: number) => `${POLYGON_NAME_PREFIX}-${index}`;

const PolygonAnnotation = ({
    imgSrc,
    points = [],
    scale = 1,
    strokeColor = yellow[600],
    anchorFillColor = white,
    onPointsChange,
}: PolygonAnnotationProps) => {
    const [imgSize, setImgSize] = useState({
        naturalWidth: 0,
        naturalHeight: 0,
        width: 0,
        height: 0,
    });
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [dragMoving, setDragMoving] = useState(false);
    const transformerRef = React.useRef<any>(null);

    // Colors
    const colors = useMemo(() => {
        if (Array.isArray(strokeColor)) return strokeColor;
        return Array(points.length).fill(strokeColor);
    }, [strokeColor, points.length]);

    // Get size of image
    useEffect(() => {
        const img = new window.Image();
        img.src = imgSrc;
        img.onload = () => {
            setImage(img);
            setImgSize({
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                width: img.naturalWidth * scale,
                height: img.naturalHeight * scale,
            });
        };
    }, [imgSrc, scale]);

    // Enable Transformer when selected
    useEffect(() => {
        if (selectedId === null || !transformerRef.current) return;

        const node = transformerRef.current?.getStage()?.findOne(`.${getPolygonId(selectedId)}`);
        if (node) {
            transformerRef.current.nodes([node]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedId]);

    // Calculate the coordinates of the top left corner of the polygon
    const getPolygonTopLeft = (polygonPoints: Vector2d[]) => {
        return polygonPoints.reduce(
            (acc, point) => ({
                x: Math.min(acc.x, point.x),
                y: Math.min(acc.y, point.y),
            }),
            { x: Infinity, y: Infinity },
        );
    };

    // Update position
    const handlePositionChange = useMemoizedFn((index: number, newPoints: Vector2d[]) => {
        const updated = [...points];
        updated[index] = newPoints;
        onPointsChange?.(updated);
    });

    if (!image) return null;

    return (
        <Stage
            width={imgSize.width}
            height={imgSize.height}
            onClick={e => {
                const name = e.target.name();

                if (name?.includes(POLYGON_NAME_PREFIX)) return;
                setSelectedId(null);
            }}
        >
            <Layer scaleX={scale} scaleY={scale}>
                <Image image={image} width={imgSize.naturalWidth} height={imgSize.naturalHeight} />

                {points.map((polygonPoints, index) => {
                    const topLeft = getPolygonTopLeft(polygonPoints);

                    return (
                        <React.Fragment key={getPolygonId(index)}>
                            <Line
                                closed
                                name={getPolygonId(index)}
                                points={polygonPoints.flatMap(p => [p.x, p.y])}
                                stroke={colors[index]}
                                strokeWidth={2 / scale}
                                strokeScaleEnabled={false}
                                draggable={!!onPointsChange}
                                onDragMove={() => setDragMoving(true)}
                                onDragEnd={e => {
                                    const absPos = e.target.getAbsolutePosition();
                                    const newPoints = polygonPoints.map(p => ({
                                        x: p.x + absPos.x / scale,
                                        y: p.y + absPos.y / scale,
                                    }));

                                    setDragMoving(false);
                                    handlePositionChange(index, newPoints);
                                    e.target.position({ x: 0, y: 0 });
                                }}
                                onTransformEnd={e => {
                                    const node = e.target;
                                    const newPoints = polygonPoints.map((p, i) => ({
                                        x: p.x * node.scaleX() + node.x(),
                                        y: p.y * node.scaleY() + node.y(),
                                    }));

                                    // console.log({
                                    //     e,
                                    //     x: node.x(),
                                    //     y: node.y(),
                                    //     scaleX: node.scaleX(),
                                    //     scaleY: node.scaleY(),
                                    //     newPoints,
                                    // });
                                    handlePositionChange(index, newPoints);
                                    node.scaleX(1);
                                    node.scaleY(1);
                                    node.position({ x: 0, y: 0 });
                                }}
                                onClick={() => setSelectedId(index)}
                            />

                            <EditableText
                                visible={!(selectedId === index && dragMoving)}
                                content={`#${index + 1}`}
                                position={{ x: topLeft.x - 1, y: topLeft.y - 16 / scale - 7 }}
                                scale={scale}
                                color={black}
                                backgroundColor={colors[index]}
                                padding={4 / scale}
                            />
                        </React.Fragment>
                    );
                })}

                {!isNil(selectedId) && onPointsChange && (
                    <Transformer
                        ref={transformerRef}
                        anchorSize={8}
                        anchorStroke={colors[selectedId ?? 0]}
                        anchorFill={anchorFillColor}
                        borderEnabled={false}
                        rotateEnabled={false}
                        boundBoxFunc={(oldBox, newBox) => newBox}
                        borderStroke={colors[selectedId ?? 0]}
                    />
                )}
            </Layer>
        </Stage>
    );
};

export type { Vector2d };
export default PolygonAnnotation;
