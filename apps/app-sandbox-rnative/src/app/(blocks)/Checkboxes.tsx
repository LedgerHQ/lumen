import { Checkbox } from '@ledgerhq/lumen-ui-rnative';

export default function Checkboxes() {
  return (
    <>
      <Checkbox aria-valuetext='custom' label='Label' />
      <Checkbox aria-valuetext='custom' label='Label' defaultChecked />
      <Checkbox aria-valuetext='custom' label='Label' disabled />
      <Checkbox aria-valuetext='custom' label='Label' defaultChecked disabled />
    </>
  );
}
