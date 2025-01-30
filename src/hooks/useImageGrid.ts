import { useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { PerformanceMonitor } from '../utils/performance';

interface GridCell {
  row: number;
  col: number;
  isBlocked: boolean;
  distanceToComponent: number;
}

interface GridConfig {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
}

interface Point2D {
  x: number;
  y: number;
}

// Mobile-specific constants
const MOBILE = {
  MIN_CELL_WIDTH: 140, // Increased from 80
  MAX_CELL_WIDTH: 180, // Increased from 120
  GAP: 8, // Increased from 4
  DISTANCE_THRESHOLD: 80, // Increased from 60
  CELL_PADDING: 8, // Increased from 4
  VIEWPORT_PADDING: 16 // Increased from 12
};

// Desktop constants
const DESKTOP = {
  MIN_CELL_WIDTH: 200, // Increased from 140
  MAX_CELL_WIDTH: 320, // Increased from 240
  GAP: 12, // Increased from 8
  DISTANCE_THRESHOLD: 160, // Increased from 120
  CELL_PADDING: 12, // Increased from 8
  VIEWPORT_PADDING: 40 // Increased from 32
};

const projectPoint = (point3D: THREE.Vector3, camera: THREE.Camera, container: HTMLDivElement): Point2D | null => {
  const vector = point3D.clone();
  vector.project(camera);
  
  const x = (vector.x + 1) / 2 * container.clientWidth;
  const y = (-vector.y + 1) / 2 * container.clientHeight;
  
  if (vector.z > 1) return null;
  
  return { x, y };
};

const calculateDistance = (point1: Point2D, point2: Point2D): number => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + 
    Math.pow(point1.y - point2.y, 2)
  );
};

export function useImageGrid(
  containerRef: React.RefObject<HTMLDivElement>,
  hoveredActor?: { position: THREE.Vector3, size: number },
  camera?: THREE.Camera,
  isMobile?: boolean
) {
  const [grid, setGrid] = useState<GridConfig>({
    columns: 1,
    rows: 1,
    cellWidth: 0,
    cellHeight: 0,
    gap: isMobile ? MOBILE.GAP : DESKTOP.GAP
  });

  const [cells, setCells] = useState<GridCell[]>([]);
  const [lastUpdate, setLastUpdate] = useState(0);
  const performanceMonitor = useMemo(() => PerformanceMonitor.getInstance(), []);

  const componentCenter = useMemo(() => {
    if (!hoveredActor?.position || !camera || !containerRef.current) return null;
    return projectPoint(hoveredActor.position, camera, containerRef.current);
  }, [
    hoveredActor?.position?.x,
    hoveredActor?.position?.y,
    hoveredActor?.position?.z,
    camera?.position.x,
    camera?.position.y,
    camera?.position.z,
    camera?.rotation.x,
    camera?.rotation.y,
    camera?.rotation.z,
    containerRef.current?.clientWidth,
    containerRef.current?.clientHeight
  ]);

  const calculateGrid = useCallback(() => {
    if (!containerRef.current) return;

    const now = Date.now();
    if (now - lastUpdate < (isMobile ? 150 : 100)) return;
    setLastUpdate(now);

    const {
      MIN_CELL_WIDTH,
      MAX_CELL_WIDTH,
      GAP,
      VIEWPORT_PADDING
    } = isMobile ? MOBILE : DESKTOP;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const aspectRatio = 4 / 3;

    // Calculate available space
    const availableWidth = containerWidth - (VIEWPORT_PADDING * 2);
    const availableHeight = containerHeight - (VIEWPORT_PADDING * 2);

    // For mobile, aim for 2 columns max
    const maxColumns = isMobile ? Math.min(2, Math.floor(availableWidth / MIN_CELL_WIDTH)) : Math.floor(availableWidth / MIN_CELL_WIDTH);
    const columns = Math.max(2, maxColumns);

    // Calculate cell width ensuring it fits the screen
    const cellWidth = Math.min(
      (availableWidth - (GAP * (columns - 1))) / columns,
      MAX_CELL_WIDTH
    );
    const cellHeight = cellWidth / aspectRatio;

    // Calculate rows based on available height
    const maxRows = Math.floor((availableHeight + GAP) / (cellHeight + GAP));
    const rows = Math.max(1, maxRows);

    const newGrid = { columns, rows, cellWidth, cellHeight, gap: GAP };
    setGrid(newGrid);

    // Calculate grid position
    const totalGridWidth = columns * cellWidth + (columns - 1) * GAP;
    const totalGridHeight = rows * cellHeight + (rows - 1) * GAP;

    let verticalOffset = VIEWPORT_PADDING;
    if (componentCenter) {
      const normalizedY = componentCenter.y / containerHeight;
      
      if (normalizedY < 0.33) {
        verticalOffset = Math.min(
          containerHeight - totalGridHeight - VIEWPORT_PADDING,
          containerHeight * 0.5
        );
      } else if (normalizedY > 0.66) {
        verticalOffset = VIEWPORT_PADDING;
      } else {
        verticalOffset = (containerHeight - totalGridHeight) / 2;
      }
    }

    verticalOffset = Math.max(
      VIEWPORT_PADDING,
      Math.min(containerHeight - totalGridHeight - VIEWPORT_PADDING, verticalOffset)
    );

    const horizontalOffset = Math.max(
      VIEWPORT_PADDING,
      (containerWidth - totalGridWidth) / 2
    );

    // Calculate cells with blocking
    const newCells = [];
    const { DISTANCE_THRESHOLD, CELL_PADDING } = isMobile ? MOBILE : DESKTOP;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const cellLeft = horizontalOffset + col * (cellWidth + GAP);
        const cellTop = verticalOffset + row * (cellHeight + GAP);
        const cellRight = cellLeft + cellWidth;
        const cellBottom = cellTop + cellHeight;
        const cellCenterX = (cellLeft + cellRight) / 2;
        const cellCenterY = (cellTop + cellBottom) / 2;

        let isBlocked = false;
        let distanceToComponent = Infinity;

        if (componentCenter) {
          distanceToComponent = calculateDistance(
            { x: cellCenterX, y: cellCenterY },
            componentCenter
          );

          const threshold = hoveredActor?.size === 3 
            ? DISTANCE_THRESHOLD * 1.2 
            : DISTANCE_THRESHOLD;

          isBlocked = distanceToComponent < threshold;

          // Block cells near viewport edges
          if (
            cellLeft < VIEWPORT_PADDING ||
            cellRight > containerWidth - VIEWPORT_PADDING ||
            cellTop < VIEWPORT_PADDING ||
            cellBottom > containerHeight - VIEWPORT_PADDING
          ) {
            isBlocked = true;
          }

          // Check corners for blocking
          const cornerPadding = CELL_PADDING * (hoveredActor?.size === 3 ? 1.5 : 1);
          const corners = [
            { x: cellLeft - cornerPadding, y: cellTop - cornerPadding },
            { x: cellRight + cornerPadding, y: cellTop - cornerPadding },
            { x: cellRight + cornerPadding, y: cellBottom + cornerPadding },
            { x: cellLeft - cornerPadding, y: cellBottom + cornerPadding }
          ];

          for (const corner of corners) {
            if (calculateDistance(corner, componentCenter) < threshold) {
              isBlocked = true;
              break;
            }
          }
        }

        newCells.push({ row, col, isBlocked, distanceToComponent });
      }
    }

    setCells(newCells);
  }, [componentCenter, hoveredActor?.size, isMobile, lastUpdate]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!performanceMonitor.throttle('gridResize', isMobile ? 150 : 100)) {
        calculateGrid();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const interval = setInterval(calculateGrid, isMobile ? 150 : 100);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [calculateGrid, isMobile, performanceMonitor]);

  const availableCells = useMemo(() => 
    cells
      .filter(cell => !cell.isBlocked)
      .sort((a, b) => b.distanceToComponent - a.distanceToComponent),
    [cells]
  );

  const getImageStyle = useCallback((index: number): React.CSSProperties => {
    if (index >= availableCells.length) return { display: 'none' };

    const cell = availableCells[index];
    const containerWidth = containerRef.current?.clientWidth || 0;
    const containerHeight = containerRef.current?.clientHeight || 0;
    const { VIEWPORT_PADDING, GAP } = isMobile ? MOBILE : DESKTOP;

    const totalGridWidth = grid.columns * grid.cellWidth + (grid.columns - 1) * GAP;
    const totalGridHeight = grid.rows * grid.cellHeight + (grid.rows - 1) * GAP;

    let verticalOffset = VIEWPORT_PADDING;
    if (componentCenter) {
      const normalizedY = componentCenter.y / containerHeight;
      if (normalizedY < 0.33) {
        verticalOffset = Math.min(
          containerHeight - totalGridHeight - VIEWPORT_PADDING,
          containerHeight * 0.5
        );
      } else if (normalizedY > 0.66) {
        verticalOffset = VIEWPORT_PADDING;
      } else {
        verticalOffset = (containerHeight - totalGridHeight) / 2;
      }
    }

    verticalOffset = Math.max(
      VIEWPORT_PADDING,
      Math.min(containerHeight - totalGridHeight - VIEWPORT_PADDING, verticalOffset)
    );

    const horizontalOffset = Math.max(
      VIEWPORT_PADDING,
      (containerWidth - totalGridWidth) / 2
    );

    return {
      position: 'absolute',
      left: `${horizontalOffset + cell.col * (grid.cellWidth + GAP)}px`,
      top: `${verticalOffset + cell.row * (grid.cellHeight + GAP)}px`,
      width: `${grid.cellWidth}px`,
      height: `${grid.cellHeight}px`,
      transition: isMobile ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
    };
  }, [availableCells, grid, componentCenter, isMobile]);

  return {
    grid,
    availableCells,
    getImageStyle
  };
}