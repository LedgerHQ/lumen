import { Switch } from '@ledgerhq/lumen-ui-rnative';

export default function Switches() {
  return (
    <>
      <Switch aria-valuetext='custom' />
      <Switch aria-valuetext='custom' defaultChecked />
      <Switch aria-valuetext='custom' disabled />
      <Switch aria-valuetext='custom' defaultChecked disabled />
    </>
  );
}
