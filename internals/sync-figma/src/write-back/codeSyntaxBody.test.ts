import { describe, expect, it } from 'vitest';
import { loadFixture } from '../testing/fixtures.js';
import { codeSyntaxUpdateBody } from './codeSyntaxBody.js';

describe('codeSyntaxUpdateBody', () => {
  it('updates only the variables whose code syntax differs from the build', () => {
    const response = loadFixture('get-local-variables-response.json');
    response.meta.variables['VariableID:2215:48'].codeSyntax = {
      WEB: 'var(--radius-4);',
    };

    const body = codeSyntaxUpdateBody(response, {
      '1.Primitives': {
        'Radius/4': { WEB: 'var(--radius-4);' },
        'Colors/Light/Constant/050': {
          WEB: 'var(--colors-light-constant-050);',
        },
      },
    });

    expect(body.variables).toEqual([
      {
        id: 'VariableID:2215:71',
        action: 'UPDATE',
        codeSyntax: { WEB: 'var(--colors-light-constant-050);' },
      },
    ]);
  });

  it('leaves variables deleted in Figma alone', () => {
    const response = loadFixture('get-local-variables-response.json');
    response.meta.variables['VariableID:2215:71'].deletedButReferenced = true;

    const body = codeSyntaxUpdateBody(response, {
      '1.Primitives': {
        'Colors/Light/Constant/050': {
          WEB: 'var(--colors-light-constant-050);',
        },
      },
    });

    expect(body.variables).toEqual([]);
  });

  it('sets the React Native path for iOS and Android too', () => {
    const response = loadFixture('get-local-variables-response.json');
    response.meta.variables['VariableID:2215:48'].codeSyntax = {
      WEB: 'var(--radius-4);',
    };

    const body = codeSyntaxUpdateBody(response, {
      '1.Primitives': {
        'Radius/4': {
          WEB: 'var(--radius-4);',
          iOS: 't.borderRadius.s4',
          ANDROID: 't.borderRadius.s4',
        },
      },
    });

    expect(body.variables?.[0]).toMatchObject({
      codeSyntax: {
        WEB: 'var(--radius-4);',
        iOS: 't.borderRadius.s4',
        ANDROID: 't.borderRadius.s4',
      },
    });
  });

  it('leaves variables the build does not name alone', () => {
    const body = codeSyntaxUpdateBody(
      loadFixture('get-local-variables-response.json'),
      {},
    );

    expect(body.variables).toEqual([]);
  });
});
