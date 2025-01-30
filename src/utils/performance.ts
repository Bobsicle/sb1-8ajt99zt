// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 60;
  private fpsHistory: number[] = [];
  private throttleTimers: Map<string, number> = new Map();
  private rafId: number | null = null;

  private constructor() {
    this.updateFPS();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private updateFPS() {
    const now = performance.now();
    if (this.lastTime) {
      const currentFPS = 1000 / (now - this.lastTime);
      this.fpsHistory.push(currentFPS);
      
      // Keep last 60 frames for average
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      // Calculate average FPS
      this.fps = this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length;
    }
    this.lastTime = now;
    this.frameCount++;
    this.rafId = requestAnimationFrame(() => this.updateFPS());
  }

  cleanup() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  getFPS(): number {
    return this.fps;
  }

  shouldSkipFrame(interval: number): boolean {
    return this.frameCount % interval !== 0;
  }

  // Adaptive throttling based on performance
  throttle(key: string, baseInterval: number): boolean {
    const now = performance.now();
    const lastRun = this.throttleTimers.get(key) || 0;
    const interval = this.shouldReduceQuality() ? baseInterval * 2 : baseInterval;
    
    if (now - lastRun >= interval) {
      this.throttleTimers.set(key, now);
      return false;
    }
    return true;
  }

  // Check if we should reduce quality based on FPS
  shouldReduceQuality(): boolean {
    return this.fps < 30;
  }

  // Get current performance level (0-3)
  getPerformanceLevel(): number {
    if (this.fps >= 55) return 3; // High
    if (this.fps >= 45) return 2; // Medium
    if (this.fps >= 30) return 1; // Low
    return 0; // Very Low
  }
}

// Enhanced object pooling with size management
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  private maxSize: number;
  private created: number = 0;

  constructor(
    createFn: () => T, 
    resetFn: (obj: T) => void, 
    initialSize: number = 100,
    maxSize: number = 1000
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
      this.created++;
    }
  }

  acquire(): T {
    if (this.pool.length === 0 && this.created < this.maxSize) {
      this.created++;
      return this.createFn();
    }
    return this.pool.pop() || this.createFn();
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  clear(): void {
    this.pool = [];
    this.created = 0;
  }
}

// Enhanced batch processing with adaptive timing
export class BatchProcessor {
  static async process<T>(
    items: T[],
    processFn: (item: T, index: number) => void,
    batchSize: number = 100,
    maxTimePerBatch: number = 16
  ): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      const performanceMonitor = PerformanceMonitor.getInstance();

      const processBatch = () => {
        const startTime = performance.now();
        const adaptiveBatchSize = performanceMonitor.shouldReduceQuality() 
          ? Math.floor(batchSize / 2) 
          : batchSize;
        
        while (index < items.length) {
          processFn(items[index], index);
          index++;
          
          if (index % adaptiveBatchSize === 0) {
            if (performance.now() - startTime > maxTimePerBatch) {
              requestAnimationFrame(processBatch);
              return;
            }
          }
        }
        
        resolve();
      };

      processBatch();
    });
  }

  // Process items in parallel when possible
  static async processParallel<T, R>(
    items: T[],
    processFn: (item: T) => Promise<R>,
    maxConcurrent: number = 4
  ): Promise<R[]> {
    const results: R[] = [];
    let index = 0;

    const processNext = async (): Promise<void> => {
      const currentIndex = index++;
      if (currentIndex >= items.length) return;

      results[currentIndex] = await processFn(items[currentIndex]);
      return processNext();
    };

    const workers = Array(Math.min(maxConcurrent, items.length))
      .fill(null)
      .map(() => processNext());

    await Promise.all(workers);
    return results;
  }
}

// Memory management utility
export class MemoryManager {
  private static disposableObjects = new Set<THREE.Object3D | THREE.Material | THREE.Geometry | THREE.BufferGeometry>();

  static track(obj: THREE.Object3D | THREE.Material | THREE.Geometry | THREE.BufferGeometry): void {
    this.disposableObjects.add(obj);
  }

  static untrack(obj: THREE.Object3D | THREE.Material | THREE.Geometry | THREE.BufferGeometry): void {
    this.disposableObjects.delete(obj);
  }

  static dispose(): void {
    this.disposableObjects.forEach(obj => {
      if ('dispose' in obj && typeof obj.dispose === 'function') {
        obj.dispose();
      }
    });
    this.disposableObjects.clear();
  }
}