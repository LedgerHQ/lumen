import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  describe('uncontrolled mode', () => {
    it('should use defaultProp as initial value', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 'initial',
        }),
      );

      expect(result.current[0]).toBe('initial');
    });

    it('should update internal state when setValue is called', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: false,
        }),
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('should call onChange when value changes', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 0,
          onChange,
        }),
      );

      act(() => {
        result.current[1](5);
      });

      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should support function updater', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 10,
        }),
      );

      act(() => {
        result.current[1]((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(15);
    });
  });

  describe('controlled mode', () => {
    it('should use prop value when provided', () => {
      const { result } = renderHook(() =>
        useControllableState({
          prop: 'controlled',
          defaultProp: 'default',
        }),
      );

      expect(result.current[0]).toBe('controlled');
    });

    it('should call onChange but not update internal state when controlled', () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ prop }) =>
          useControllableState({
            prop,
            defaultProp: 'default',
            onChange,
          }),
        { initialProps: { prop: 'controlled' } },
      );

      act(() => {
        result.current[1]('new-value');
      });

      // Should call onChange
      expect(onChange).toHaveBeenCalledWith('new-value');

      // Value should still be the controlled prop (parent hasn't updated it)
      expect(result.current[0]).toBe('controlled');

      // When parent updates the prop, value should change
      rerender({ prop: 'new-value' });
      expect(result.current[0]).toBe('new-value');
    });

    it('should sync internal state when prop changes', () => {
      const { result, rerender } = renderHook(
        ({ prop }) =>
          useControllableState({
            prop,
            defaultProp: 'default',
          }),
        { initialProps: { prop: 'initial' } },
      );

      expect(result.current[0]).toBe('initial');

      rerender({ prop: 'updated' });

      expect(result.current[0]).toBe('updated');
    });
  });

  describe('switching modes', () => {
    it('should handle switching from uncontrolled to controlled', () => {
      const { result, rerender } = renderHook(
        ({ prop }) =>
          useControllableState({
            prop,
            defaultProp: 'default',
          }),
        { initialProps: { prop: undefined as string | undefined } },
      );

      // Start uncontrolled
      expect(result.current[0]).toBe('default');

      act(() => {
        result.current[1]('uncontrolled-update');
      });
      expect(result.current[0]).toBe('uncontrolled-update');

      // Switch to controlled
      rerender({ prop: 'controlled-value' });
      expect(result.current[0]).toBe('controlled-value');
    });
  });
});
