export type BlockMeta = {
  slug: string;
  title: string;
};

export const blocks: BlockMeta[] = [
  { slug: 'AmountDisplays', title: 'Amount displays' },
  { slug: 'AmountInputs', title: 'Amount inputs' },
  { slug: 'Animations', title: 'Animations' },
  { slug: 'Avatars', title: 'Avatar' },
  { slug: 'Banners', title: 'Banners' },
  { slug: 'BottomSheets', title: 'Bottom sheets' },
  { slug: 'Buttons', title: 'Buttons' },
  { slug: 'CardButtons', title: 'Card buttons' },
  { slug: 'Cards', title: 'Cards' },
  { slug: 'Checkboxes', title: 'Checkboxes' },
  { slug: 'ContentBanners', title: 'Content banners' },
  { slug: 'DescriptionLists', title: 'Description lists' },
  { slug: 'Dividers', title: 'Dividers' },
  { slug: 'DotCounts', title: 'Dot counts' },
  { slug: 'DotIcons', title: 'Dot icons' },
  { slug: 'DotIndicators', title: 'Dot indicators' },
  { slug: 'DotSymbols', title: 'Dot symbols' },
  { slug: 'Gradients', title: 'Gradients' },
  { slug: 'IconButtons', title: 'Icon buttons' },
  { slug: 'InteractiveIcons', title: 'Interactive icons' },
  { slug: 'LineCharts', title: 'Line charts' },
  { slug: 'Links', title: 'Links' },
  { slug: 'ListItems', title: 'List items' },
  { slug: 'MediaBanners', title: 'Media banners' },
  { slug: 'MediaButtons', title: 'Media buttons' },
  { slug: 'MediaCards', title: 'Media cards' },
  { slug: 'MediaImages', title: 'Media images' },
  { slug: 'MediaTags', title: 'Media tags' },
  { slug: 'NavBars', title: 'Navbars' },
  { slug: 'OptionLists', title: 'Option lists' },
  { slug: 'PageIndicators', title: 'Page indicators' },
  { slug: 'SegmentedControls', title: 'Segmented controls' },
  { slug: 'Skeletons', title: 'Skeletons' },
  { slug: 'Spots', title: 'Spots' },
  { slug: 'Steppers', title: 'Steppers' },
  { slug: 'Subheaders', title: 'Subheaders' },
  { slug: 'Switches', title: 'Switches' },
  { slug: 'TabBars', title: 'Tab bars' },
  { slug: 'Tags', title: 'Tags' },
  { slug: 'TextInputs', title: 'Text inputs' },
  { slug: 'ThemeProviderToggles', title: 'Theme provider toggles' },
  { slug: 'Tiles', title: 'Tiles' },
  { slug: 'Tooltips', title: 'Tooltips' },
  { slug: 'Trends', title: 'Trends' },
];

export const getBlockTitle = (slug: string): string | undefined =>
  blocks.find((block) => block.slug === slug)?.title;
