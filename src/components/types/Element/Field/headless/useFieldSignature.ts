/**
 * useSignatureField - Signature capture 헤드리스 훅
 *
 * IDDL Field Spec: Picker Category - Signature
 * Canvas 기반 서명 캡처
 *
 * @see docs/2-areas/spec/4-element/field/field.spec.md#644-signature
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export type SignatureOutputFormat = 'png' | 'jpeg' | 'svg' | 'dataUrl';

export interface UseSignatureFieldOptions {
  /**
   * Pen color
   */
  penColor?: string;

  /**
   * Pen width
   */
  penWidth?: number;

  /**
   * Canvas background color
   */
  backgroundColor?: string;

  /**
   * Output format
   */
  outputFormat?: SignatureOutputFormat;

  /**
   * Trim whitespace on export
   */
  trimWhitespace?: boolean;

  /**
   * Current value (base64 data URL)
   */
  value?: string;

  /**
   * onChange callback
   */
  onChange?: (value: string) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface UseSignatureFieldReturn {
  /**
   * Canvas ref
   */
  canvasRef: React.RefObject<HTMLCanvasElement>;

  /**
   * Is currently drawing
   */
  isDrawing: boolean;

  /**
   * Has any signature been drawn
   */
  isEmpty: boolean;

  /**
   * Start drawing
   */
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;

  /**
   * Continue drawing
   */
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;

  /**
   * Stop drawing
   */
  stopDrawing: () => void;

  /**
   * Clear signature
   */
  clear: () => void;

  /**
   * Undo last stroke
   */
  undo: () => void;

  /**
   * Export signature as data URL
   */
  exportSignature: () => string;
}

/**
 * useSignatureField Hook
 */
export function useFieldSignature({
  penColor = '#000000',
  penWidth = 2,
  backgroundColor = '#FFFFFF',
  outputFormat = 'png',
  trimWhitespace = true,
  value: controlledValue,
  onChange,
  disabled = false,
}: UseSignatureFieldOptions): UseSignatureFieldReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [strokes, setStrokes] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const currentStroke = useRef<Array<{ x: number; y: number }>>([]);

  /**
   * Initialize canvas
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load controlled value if exists
    if (controlledValue) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setIsEmpty(false);
      };
      img.src = controlledValue;
    }
  }, [backgroundColor, controlledValue]);

  /**
   * Redraw all strokes
   */
  const redrawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all strokes
    strokes.forEach((stroke) => {
      if (stroke.length === 0) return;

      ctx.beginPath();
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }, [strokes, penColor, penWidth, backgroundColor]);

  /**
   * Get pointer position
   */
  const getPointerPosition = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  /**
   * Start drawing
   */
  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (disabled) return;

      const pos = getPointerPosition(e);
      if (!pos) return;

      setIsDrawing(true);
      setIsEmpty(false);
      currentStroke.current = [pos];

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(pos.x, pos.y);
    },
    [disabled, penColor, penWidth]
  );

  /**
   * Continue drawing
   */
  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const pos = getPointerPosition(e);
      if (!pos) return;

      currentStroke.current.push(pos);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing]
  );

  /**
   * Stop drawing
   */
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (currentStroke.current.length > 0) {
      setStrokes((prev) => [...prev, currentStroke.current]);
      currentStroke.current = [];

      // Emit onChange with exported data
      if (onChange) {
        const dataUrl = exportSignature();
        onChange(dataUrl);
      }
    }
  }, [isDrawing, onChange]);

  /**
   * Clear signature
   */
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setStrokes([]);
    setIsEmpty(true);

    if (onChange) {
      onChange('');
    }
  }, [backgroundColor, onChange]);

  /**
   * Undo last stroke
   */
  const undo = useCallback(() => {
    if (strokes.length === 0) return;

    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);

    if (newStrokes.length === 0) {
      setIsEmpty(true);
    }

    // Redraw after undo
    setTimeout(() => {
      redrawStrokes();
    }, 0);
  }, [strokes, redrawStrokes]);

  /**
   * Export signature
   */
  const exportSignature = useCallback((): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    return canvas.toDataURL(mimeType);
  }, [outputFormat]);

  // Redraw when strokes change
  useEffect(() => {
    redrawStrokes();
  }, [redrawStrokes]);

  return {
    canvasRef,
    isDrawing,
    isEmpty,
    startDrawing,
    draw,
    stopDrawing,
    clear,
    undo,
    exportSignature,
  };
}
