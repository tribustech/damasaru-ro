import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCardItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_items';
  info: {
    displayName: 'Card Item';
    icon: 'feather';
  };
  attributes: {
    href: Schema.Attribute.String;
    iconImage: Schema.Attribute.Media<'images'>;
    iconName: Schema.Attribute.String;
    tag: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
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
    emailLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Email'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    messageLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Mesaj'>;
    nameLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Nume'>;
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
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
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
    formId: Schema.Attribute.String & Schema.Attribute.DefaultTo<'default'>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Adresa ta de email'>;
    subtext: Schema.Attribute.Text;
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
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
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
    body: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    headingItalic: Schema.Attribute.String;
    posterImage: Schema.Attribute.Media<'images'>;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_buttons';
  info: {
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
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
      'sections.newsletter-form': SectionsNewsletterForm;
      'sections.quote-large': SectionsQuoteLarge;
      'sections.stat-item': SectionsStatItem;
      'sections.stats-strip': SectionsStatsStrip;
      'sections.testimonial-item': SectionsTestimonialItem;
      'sections.testimonials': SectionsTestimonials;
      'sections.text-block': SectionsTextBlock;
      'sections.video-feature': SectionsVideoFeature;
      'shared.cta-button': SharedCtaButton;
    }
  }
}
