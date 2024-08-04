import { useCallback } from 'react';
import useEventListener from './useEventListener';

type Hotkey = [string, () => void];
type ElementSelector = string[];

export function getHotkeyHandler(hotkeys: Hotkey[]) {
  const onKeyDown = (event: KeyboardEvent) => {
    const pressedKey = event.key?.toLowerCase();
    const modifierKeys = new Set(['control', 'shift', 'alt', 'meta']);
    const isModifierPressed = modifierKeys.has(pressedKey);
    const hotkeyPressed = hotkeys.find(([hotkey]) => {
      const [key, modifiers] = hotkey.split('+').toReversed();
      const hasModifier = modifiers
        ? !!event[(modifiers + 'Key') as keyof typeof event]
        : !isModifierPressed;
      return hasModifier && key?.toLowerCase() === pressedKey;
    });

    if (hotkeyPressed) {
      const [, action] = hotkeyPressed;
      action();
    }
  };

  return onKeyDown;
}

const useHotkeys = (hotkeys: Hotkey[], ignoreElements?: ElementSelector) => {
  const shouldIgnoreElement = (element: HTMLElement) =>
    ignoreElements?.some(selector => element.matches(selector));

  const handleHotkeyEvent = useCallback(
    (event: KeyboardEvent) => getHotkeyHandler(hotkeys)(event),
    [hotkeys],
  );

  useEventListener('keydown', (event: KeyboardEvent) => {
    const element = event.target as HTMLElement;
    if (!shouldIgnoreElement(element)) {
      handleHotkeyEvent(event);
    }
  });
};

export default useHotkeys;
