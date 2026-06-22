import type { Schema, Struct } from '@strapi/strapi';

export interface MediaLogoCell extends Struct.ComponentSchema {
  collectionName: 'components_media_logo_cells';
  info: {
    displayName: 'Logo Cell';
    icon: 'grid';
  };
  attributes: {
    count: Schema.Attribute.String;
    description: Schema.Attribute.String;
    href: Schema.Attribute.String;
    outletName: Schema.Attribute.String & Schema.Attribute.Required;
    svgKey: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MediaPressKitCard extends Struct.ComponentSchema {
  collectionName: 'components_media_press_kit_cards';
  info: {
    displayName: 'Press Kit Card';
    icon: 'file';
  };
  attributes: {
    description: Schema.Attribute.Text;
    file: Schema.Attribute.Media<'images' | 'files'>;
    iconKey: Schema.Attribute.Enumeration<['document', 'camera', 'mail']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'document'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAsocBox extends Struct.ComponentSchema {
  collectionName: 'components_sections_asoc_boxes';
  info: {
    displayName: 'Asoc Box';
    icon: 'information';
  };
  attributes: {
    body: Schema.Attribute.Text;
    statusText: Schema.Attribute.String;
    title: Schema.Attribute.String;
    titleItalic: Schema.Attribute.String;
  };
}

export interface SectionsCardItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_items';
  info: {
    displayName: 'Card Item';
    icon: 'feather';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    fineprint: Schema.Attribute.String;
    format: Schema.Attribute.Enumeration<['hardcover', 'ebook', 'audiobook']>;
    href: Schema.Attribute.String;
    iconImage: Schema.Attribute.Media<'images'>;
    iconName: Schema.Attribute.String;
    metaItems: Schema.Attribute.Component<'sections.meta-item', true>;
    price: Schema.Attribute.String;
    priceText: Schema.Attribute.String;
    tag: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCardsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_cards_grids';
  info: {
    displayName: 'Cards Grid';
    icon: 'apps';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.card-item', true>;
    lead: Schema.Attribute.Text;
    variant: Schema.Attribute.Enumeration<
      [
        'default',
        'convictions',
        'cta-cards',
        'chapters',
        'products',
        'platforms',
        'channels',
      ]
    > &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    displayName: 'Contact Form';
    icon: 'envelop';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    audienceSizeLabel: Schema.Attribute.String;
    audienceSizeOptions: Schema.Attribute.Component<'shared.form-option', true>;
    audienceSizePlaceholder: Schema.Attribute.String;
    budgetLabel: Schema.Attribute.String;
    budgetOptions: Schema.Attribute.Component<'shared.form-option', true>;
    budgetPlaceholder: Schema.Attribute.String;
    consentText: Schema.Attribute.Text;
    dateEstimateLabel: Schema.Attribute.String;
    dateEstimatePlaceholder: Schema.Attribute.String;
    emailLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Email'>;
    emailPlaceholder: Schema.Attribute.String;
    eventTypeLabel: Schema.Attribute.String;
    eventTypeOptions: Schema.Attribute.Component<'shared.form-option', true>;
    eventTypePlaceholder: Schema.Attribute.String;
    expectationNote: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    fineprint: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    messageLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Mesaj'>;
    messagePlaceholder: Schema.Attribute.String;
    nameLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Nume'>;
    namePlaceholder: Schema.Attribute.String;
    optionalSectionLabel: Schema.Attribute.String;
    organizationLabel: Schema.Attribute.String;
    organizationOptional: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    organizationPlaceholder: Schema.Attribute.String;
    phoneLabel: Schema.Attribute.String;
    phonePlaceholder: Schema.Attribute.String;
    subjectLabel: Schema.Attribute.String;
    subjectOptions: Schema.Attribute.Component<'shared.form-option', true>;
    subjectPlaceholder: Schema.Attribute.String;
    submitLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Trimite'>;
    subtext: Schema.Attribute.Text;
    successMessage: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Mul\u021Bumim, mesajul a fost trimis.'>;
  };
}

export interface SectionsCredentialGroup extends Struct.ComponentSchema {
  collectionName: 'components_sections_credential_groups';
  info: {
    displayName: 'Credential Group';
    icon: 'list';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    imageCaption: Schema.Attribute.Text;
    items: Schema.Attribute.JSON & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCredentialsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_credentials_grids';
  info: {
    displayName: 'Credentials Grid';
    icon: 'bulletList';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper-warm'>;
    eyebrow: Schema.Attribute.String;
    groups: Schema.Attribute.Component<'sections.credential-group', true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    lead: Schema.Attribute.Text;
  };
}

export interface SectionsCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_banners';
  info: {
    displayName: 'CTA Banner';
    icon: 'megaphone';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    buttonHref: Schema.Attribute.String & Schema.Attribute.Required;
    buttonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    subtext: Schema.Attribute.Text;
  };
}

export interface SectionsDownloadItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_download_items';
  info: {
    displayName: 'Download Item';
    icon: 'file';
  };
  attributes: {
    description: Schema.Attribute.String;
    file: Schema.Attribute.Media & Schema.Attribute.Required;
    group: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsDownloadsList extends Struct.ComponentSchema {
  collectionName: 'components_sections_downloads_lists';
  info: {
    displayName: 'Downloads List';
    icon: 'download';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'sections.download-item', true>;
  };
}

export interface SectionsEventFeature extends Struct.ComponentSchema {
  collectionName: 'components_sections_event_features';
  info: {
    displayName: 'Event Feature';
    icon: 'calendar';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    cta: Schema.Attribute.Component<'shared.cta-button', false>;
    event: Schema.Attribute.Relation<'oneToOne', 'api::event.event'>;
    eyebrow: Schema.Attribute.String;
  };
}

export interface SectionsFaqAccordion extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_accordions';
  info: {
    displayName: 'FAQ Accordion';
    icon: 'discuss';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'sections.faq-item', true>;
  };
}

export interface SectionsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeaturedList extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_lists';
  info: {
    displayName: 'Featured List';
    icon: 'bulletList';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    filterBy: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<
      [
        'grid',
        'row',
        'marquee',
        'feature',
        'featured-with-list',
        'featured-with-grid',
        'list-rows',
        'event-banner',
      ]
    > &
      Schema.Attribute.DefaultTo<'grid'>;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    relation: Schema.Attribute.Enumeration<
      [
        'articles',
        'events',
        'podcast-episodes',
        'projects',
        'products',
        'testimonials',
        'press-mentions',
      ]
    > &
      Schema.Attribute.Required;
    seeAllHref: Schema.Attribute.String;
    seeAllLabel: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
    icon: 'tv';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    body: Schema.Attribute.Text;
    ctaButtons: Schema.Attribute.Component<'shared.cta-button', true>;
    eyebrow: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images'>;
    mediaPosition: Schema.Attribute.Enumeration<
      ['right', 'left', 'below', 'none']
    > &
      Schema.Attribute.DefaultTo<'right'>;
    projectsStripLabel: Schema.Attribute.String;
    statsStrip: Schema.Attribute.Component<'sections.stats-strip', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleItalic: Schema.Attribute.String;
  };
}

export interface SectionsImageTextSplit extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_text_splits';
  info: {
    displayName: 'Image + Text Split';
    icon: 'picture';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    body: Schema.Attribute.RichText;
    cta: Schema.Attribute.Component<'shared.cta-button', false>;
    externalLinks: Schema.Attribute.Component<'shared.external-link', true>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageCaption: Schema.Attribute.Text;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    projectsRow: Schema.Attribute.Component<'shared.project-mini', true>;
  };
}

export interface SectionsLogoItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_logo_items';
  info: {
    displayName: 'Logo Item';
    icon: 'picture';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SectionsLogoWall extends Struct.ComponentSchema {
  collectionName: 'components_sections_logo_walls';
  info: {
    displayName: 'Logo Wall';
    icon: 'grid';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.logo-item', true>;
  };
}

export interface SectionsMediaFeatured extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_featureds';
  info: {
    displayName: 'Media Featured';
    icon: 'play';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper-warm'>;
    eyebrow: Schema.Attribute.String;
    filterBy: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<8>;
    relation: Schema.Attribute.Enumeration<['press-mentions']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'press-mentions'>;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsMediaHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_heroes';
  info: {
    displayName: 'Media Hero';
    icon: 'tv';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    badgeLabel: Schema.Attribute.String;
    body: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleItalic: Schema.Attribute.String;
  };
}

export interface SectionsMediaLogoWall extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_logo_walls';
  info: {
    displayName: 'Media Logo Wall';
    icon: 'grid';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    items: Schema.Attribute.Component<'media.logo-cell', true>;
    lead: Schema.Attribute.Text;
  };
}

export interface SectionsMediaMagazines extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_magazines';
  info: {
    displayName: 'Media Magazines';
    icon: 'book';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    filterBy: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<5>;
    relation: Schema.Attribute.Enumeration<['press-mentions']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'press-mentions'>;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsMediaMarquee extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_marquees';
  info: {
    displayName: 'Media Marquee';
    icon: 'arrowRight';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    filterBy: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<60>;
    relation: Schema.Attribute.Enumeration<['press-mentions']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'press-mentions'>;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsMediaPressKit extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_press_kits';
  info: {
    displayName: 'Media Press Kit';
    icon: 'briefcase';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'media.press-kit-card', true>;
  };
}

export interface SectionsMediaStatStrip extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_stat_strips';
  info: {
    displayName: 'Media Stat Strip';
    icon: 'chartCircle';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    items: Schema.Attribute.Component<'sections.stat-item', true>;
  };
}

export interface SectionsMetaItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_meta_items';
  info: {
    displayName: 'Meta Item';
    icon: 'bulletList';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsNewsletterForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_newsletter_forms';
  info: {
    displayName: 'Newsletter Form';
    icon: 'envelop';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy-deep'>;
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Aboneaz\u0103-te'>;
    eyebrow: Schema.Attribute.String;
    fineprint: Schema.Attribute.String;
    formId: Schema.Attribute.String & Schema.Attribute.DefaultTo<'default'>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Adresa ta de email'>;
    subtext: Schema.Attribute.Text;
  };
}

export interface SectionsPressBrand extends Struct.ComponentSchema {
  collectionName: 'components_sections_press_brands';
  info: {
    displayName: 'Press Brand';
    icon: 'certificate';
  };
  attributes: {
    brandKey: Schema.Attribute.String & Schema.Attribute.Required;
    info: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SectionsPressSecondaryItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_press_secondary_items';
  info: {
    displayName: 'Press Secondary Item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SectionsPressWall extends Struct.ComponentSchema {
  collectionName: 'components_sections_press_walls';
  info: {
    displayName: 'Press Wall';
    icon: 'bullhorn';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    collapseLabel: Schema.Attribute.String;
    expandLabel: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.press-brand', true>;
    secondaryItems: Schema.Attribute.Component<
      'sections.press-secondary-item',
      true
    >;
    secondaryLabel: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
  };
}

export interface SectionsProiecteHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_proiecte_heroes';
  info: {
    displayName: 'Proiecte Hero';
    icon: 'tv';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    anchors: Schema.Attribute.Component<'shared.cta-button', true>;
    body: Schema.Attribute.RichText;
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleItalic: Schema.Attribute.String;
  };
}

export interface SectionsProjectFeature extends Struct.ComponentSchema {
  collectionName: 'components_sections_project_features';
  info: {
    displayName: 'Project Feature';
    icon: 'layer';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    anchorId: Schema.Attribute.String;
    asocBox: Schema.Attribute.Component<'sections.asoc-box', false>;
    body: Schema.Attribute.RichText;
    ctas: Schema.Attribute.Component<'shared.cta-button', true>;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageCaption: Schema.Attribute.Text;
    layout: Schema.Attribute.Enumeration<
      ['text-left', 'text-right', 'centered']
    > &
      Schema.Attribute.DefaultTo<'text-left'>;
    logo: Schema.Attribute.Media<'images'>;
    since: Schema.Attribute.String;
    stats: Schema.Attribute.Component<'sections.stat-item', true>;
    tagline: Schema.Attribute.Text;
    wordmark: Schema.Attribute.String & Schema.Attribute.Required;
    wordmarkItalic: Schema.Attribute.String;
    wordmarkLine2: Schema.Attribute.String;
    wordmarkLine3: Schema.Attribute.String;
  };
}

export interface SectionsQuoteLarge extends Struct.ComponentSchema {
  collectionName: 'components_sections_quote_larges';
  info: {
    displayName: 'Quote Large';
    icon: 'quote';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    attribution: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_stat_items';
  info: {
    displayName: 'Stat Item';
    icon: 'chartBubble';
  };
  attributes: {
    caption: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsStatsStrip extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_strips';
  info: {
    displayName: 'Stats Strip';
    icon: 'chartCircle';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.stat-item', true>;
  };
}

export interface SectionsTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_items';
  info: {
    displayName: 'Testimonial Item';
    icon: 'user';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials';
  info: {
    displayName: 'Testimonials';
    icon: 'quote';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    eyebrow: Schema.Attribute.String;
    filterBy: Schema.Attribute.JSON;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<6>;
  };
}

export interface SectionsTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_blocks';
  info: {
    displayName: 'Text Block';
    icon: 'layout';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'paper'>;
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    body: Schema.Attribute.RichText;
    cta: Schema.Attribute.Component<'shared.cta-button', false>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    headingItalic: Schema.Attribute.String;
  };
}

export interface SectionsVideoFeature extends Struct.ComponentSchema {
  collectionName: 'components_sections_video_features';
  info: {
    displayName: 'Video Feature';
    icon: 'play';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['navy', 'paper', 'paper-warm', 'navy-deep']
    > &
      Schema.Attribute.DefaultTo<'navy'>;
    badge: Schema.Attribute.String;
    body: Schema.Attribute.Text;
    ctaButton: Schema.Attribute.Component<'shared.cta-button', false>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    meta: Schema.Attribute.String;
    orientation: Schema.Attribute.Enumeration<['landscape', 'portrait']> &
      Schema.Attribute.DefaultTo<'landscape'>;
    posterBadgeImage: Schema.Attribute.Media<'images'>;
    posterBadgeLabel: Schema.Attribute.String;
    posterBadgeQuote: Schema.Attribute.String;
    posterImage: Schema.Attribute.Media<'images'>;
    videoFile: Schema.Attribute.Media<'videos'>;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SharedCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_buttons';
  info: {
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    goldDeep: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'outline', 'secondary']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedExternalLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_links';
  info: {
    description: 'Outbound link with arrow, used in author boxes (label + href + optional dimmed state).';
    displayName: 'External Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedFormOption extends Struct.ComponentSchema {
  collectionName: 'components_shared_form_options';
  info: {
    displayName: 'Form Option';
    icon: 'list';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    routingEmail: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedProjectMini extends Struct.ComponentSchema {
  collectionName: 'components_shared_project_minis';
  info: {
    description: 'Compact project card used in the projects-row strip (name + tag + optional link).';
    displayName: 'Project Mini Card';
    icon: 'grid';
  };
  attributes: {
    href: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    tag: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'media.logo-cell': MediaLogoCell;
      'media.press-kit-card': MediaPressKitCard;
      'sections.asoc-box': SectionsAsocBox;
      'sections.card-item': SectionsCardItem;
      'sections.cards-grid': SectionsCardsGrid;
      'sections.contact-form': SectionsContactForm;
      'sections.credential-group': SectionsCredentialGroup;
      'sections.credentials-grid': SectionsCredentialsGrid;
      'sections.cta-banner': SectionsCtaBanner;
      'sections.download-item': SectionsDownloadItem;
      'sections.downloads-list': SectionsDownloadsList;
      'sections.event-feature': SectionsEventFeature;
      'sections.faq-accordion': SectionsFaqAccordion;
      'sections.faq-item': SectionsFaqItem;
      'sections.featured-list': SectionsFeaturedList;
      'sections.hero': SectionsHero;
      'sections.image-text-split': SectionsImageTextSplit;
      'sections.logo-item': SectionsLogoItem;
      'sections.logo-wall': SectionsLogoWall;
      'sections.media-featured': SectionsMediaFeatured;
      'sections.media-hero': SectionsMediaHero;
      'sections.media-logo-wall': SectionsMediaLogoWall;
      'sections.media-magazines': SectionsMediaMagazines;
      'sections.media-marquee': SectionsMediaMarquee;
      'sections.media-press-kit': SectionsMediaPressKit;
      'sections.media-stat-strip': SectionsMediaStatStrip;
      'sections.meta-item': SectionsMetaItem;
      'sections.newsletter-form': SectionsNewsletterForm;
      'sections.press-brand': SectionsPressBrand;
      'sections.press-secondary-item': SectionsPressSecondaryItem;
      'sections.press-wall': SectionsPressWall;
      'sections.proiecte-hero': SectionsProiecteHero;
      'sections.project-feature': SectionsProjectFeature;
      'sections.quote-large': SectionsQuoteLarge;
      'sections.stat-item': SectionsStatItem;
      'sections.stats-strip': SectionsStatsStrip;
      'sections.testimonial-item': SectionsTestimonialItem;
      'sections.testimonials': SectionsTestimonials;
      'sections.text-block': SectionsTextBlock;
      'sections.video-feature': SectionsVideoFeature;
      'shared.cta-button': SharedCtaButton;
      'shared.external-link': SharedExternalLink;
      'shared.form-option': SharedFormOption;
      'shared.project-mini': SharedProjectMini;
    }
  }
}
