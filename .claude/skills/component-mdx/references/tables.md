# Table markup for MDX docs

Copy-paste template for tables inside component `.mdx` docs. This is markup, not a
convention — the rules that matter are: design-system typography
(`body-2`, `body-3`, `body-4`), colours (`text-accent`, `text-muted`,
`text-on-accent`, `bg-muted`, `bg-canvas`), spacing (`p-12`, `my-24`) and borders
(`border-muted`); the last row omits `border-b`; the first column shows utilities
and uses `text-accent`, other columns use `text-muted`.

## Container

```jsx
<div className='my-24 overflow-hidden rounded-lg'>
  <table className='w-full'>{/* table content */}</table>
</div>
```

## Full structure

```jsx
<div className='my-24 overflow-hidden rounded-lg'>
  <table className='w-full'>
    <thead>
      <tr className='border-b border-muted bg-muted'>
        <th className='p-12 text-left text-on-accent body-2'>
          Tailwind class (utilities)
        </th>
        <th className='p-12 text-left text-on-accent body-2'>styles</th>
      </tr>
    </thead>
    <tbody className='bg-canvas'>
      <tr className='border-b border-muted'>
        <td className='text-accent p-12'>h-1</td>
        <td className='p-12 text-muted'>height: var(--size-1); /* 1px */</td>
      </tr>
      {/* More rows... */}
      <tr>
        <td className='text-accent p-12'>h-256</td>
        <td className='p-12 text-muted'>
          height: var(--size-256); /* 256px */
        </td>
      </tr>
    </tbody>
  </table>
</div>
```
