import { Button } from '@ledgerhq/lumen-ui-rnative';
import { Plus } from '@ledgerhq/lumen-ui-rnative/symbols';

export default function Buttons() {
  return (
    <>
      <Button
        appearance='base'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        Base
      </Button>
      <Button
        loading
        appearance='base'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        Base
      </Button>
      <Button
        appearance='accent'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        Accent
      </Button>
      <Button
        icon={Plus}
        appearance='accent'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        With Icon
      </Button>
      <Button
        appearance='no-background'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        No Background
      </Button>
      <Button
        appearance='transparent'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        Transparent
      </Button>
      <Button
        appearance='gray'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        Gray
      </Button>
      <Button
        appearance='red'
        onPress={() => {
          console.log('Button pressed');
        }}
      >
        Red
      </Button>
    </>
  );
}
