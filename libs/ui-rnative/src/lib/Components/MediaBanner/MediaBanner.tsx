import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Pressable, Text } from '../Utility';
import {
  MediaBannerDescriptionProps,
  MediaBannerProps,
  MediaBannerTitleProps,
} from './types';

export function MediaBanner({
  lx,
  style,
  children,
  ...props
}: MediaBannerProps) {
  const styles = useStyleSheet(
    (t) => ({
      container: {},
    }),
    [],
  );

  return (
    <Pressable lx={lx} style={[styles.container, style]} {...props}>
      {children}
    </Pressable>
  );
}

export function MediaBannerTitle({
  lx,
  style,
  children,
  ...props
}: MediaBannerTitleProps) {
  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          color: t.colors.text.muted,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.description, style]} {...props}>
      {children}
    </Text>
  );
}

export function MediaBannerDescription({
  lx,
  style,
  children,
  ...props
}: MediaBannerDescriptionProps) {
  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          color: t.colors.text.muted,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.description, style]} {...props}>
      {children}
    </Text>
  );
}
