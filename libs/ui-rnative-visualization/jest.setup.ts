jest.mock('react-native-svg', () => {
  const mockReact = jest.requireActual<typeof import('react')>('react');

  const createMockComponent = (name: string) => {
    const Component = ({ children, ...props }: Record<string, unknown>) =>
      mockReact.createElement(name, props, children as React.ReactNode);
    Component.displayName = name;
    return Component;
  };

  return {
    __esModule: true,
    default: createMockComponent('Svg'),
    Svg: createMockComponent('Svg'),
    Circle: createMockComponent('Circle'),
    Rect: createMockComponent('Rect'),
    Path: createMockComponent('Path'),
    Line: createMockComponent('Line'),
    G: createMockComponent('G'),
    Text: createMockComponent('Text'),
    Defs: createMockComponent('Defs'),
    LinearGradient: createMockComponent('LinearGradient'),
    Stop: createMockComponent('Stop'),
  };
});
