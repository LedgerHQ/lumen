export type BlockMeta = {
  slug: string;
  title: string;
};

export const blocks: BlockMeta[] = [
  { slug: 'amount-displays', title: 'Amount displays' },
  { slug: 'amount-inputs', title: 'Amount inputs' },
  { slug: 'animations', title: 'Animations' },
  { slug: 'avatar', title: 'Avatar' },
  { slug: 'banners', title: 'Banners' },
  { slug: 'bottomsheets', title: 'BottomSheets' },
  { slug: 'buttons', title: 'Buttons' },
  { slug: 'cardbuttons', title: 'CardButtons' },
  { slug: 'cards', title: 'Cards' },
  { slug: 'checkboxes', title: 'Checkboxes' },
  { slug: 'contentbanners', title: 'ContentBanners' },
  { slug: 'descriptionlists', title: 'DescriptionLists' },
  { slug: 'dividers', title: 'Dividers' },
  { slug: 'dotcounts', title: 'DotCounts' },
  { slug: 'doticons', title: 'DotIcons' },
  { slug: 'dotindicators', title: 'DotIndicators' },
  { slug: 'dotsymbols', title: 'DotSymbols' },
  { slug: 'gradients', title: 'Gradients' },
  { slug: 'iconbuttons', title: 'IconButtons' },
  { slug: 'interactiveicons', title: 'InteractiveIcons' },
  { slug: 'line-charts', title: 'Line Charts' },
  { slug: 'link', title: 'Link' },
  { slug: 'listitems', title: 'ListItems' },
  { slug: 'mediabanners', title: 'MediaBanners' },
  { slug: 'mediabuttons', title: 'MediaButtons' },
  { slug: 'mediacards', title: 'MediaCards' },
  { slug: 'mediaimages', title: 'MediaImages' },
  { slug: 'mediatags', title: 'MediaTags' },
  { slug: 'navbars', title: 'NavBars' },
  { slug: 'optionlists', title: 'OptionLists' },
  { slug: 'pageindicators', title: 'PageIndicators' },
  { slug: 'segmentedcontrol', title: 'SegmentedControl' },
  { slug: 'skeletons', title: 'Skeletons' },
  { slug: 'spots', title: 'Spots' },
  { slug: 'steppers', title: 'Steppers' },
  { slug: 'subheaders', title: 'Subheaders' },
  { slug: 'switches', title: 'Switches' },
  { slug: 'tabbar', title: 'TabBar' },
  { slug: 'tags', title: 'Tags' },
  { slug: 'text-inputs', title: 'Text inputs' },
  { slug: 'theme-provider-toggles', title: 'Theme Provider toggles' },
  { slug: 'tiles', title: 'Tiles' },
  { slug: 'tooltips', title: 'Tooltips' },
  { slug: 'trends', title: 'Trends' },
];

export const getBlockTitle = (slug: string): string | undefined =>
  blocks.find((block) => block.slug === slug)?.title;
