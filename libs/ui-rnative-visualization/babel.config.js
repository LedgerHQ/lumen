export default function (api) {
  api.cache(true);

  return {
    presets: [
      [
        '@nx/react/babel',
        {
          runtime: 'automatic',
          useBuiltIns: 'usage',
        },
      ],
    ],
    env: {
      test: {
        presets: [
          ['module:@react-native/babel-preset', { useTransformReactJSX: true }],
        ],
      },
    },
  };
}
