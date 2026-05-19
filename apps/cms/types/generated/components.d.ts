import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCardItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_items';
  info: {
    displayName: 'Card Item';
    icon: 'feather';
  };
  attributes: {
    iconName: Schema.Attribute.String;
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
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.card-item', true>;
  };
}

export interface SectionsCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_banners';
  info: {
    displayName: 'CTA Banner';
    icon: 'megaphone';
  };
  attributes: {
    buttonHref: Schema.Attribute.String & Schema.Attribute.Required;
    buttonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subtext: Schema.Attribute.Text;
  };
}

export interface SectionsFeaturedList extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_lists';
  info: {
    displayName: 'Featured List';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    relation: Schema.Attribute.Enumeration<['articles', 'events']> &
      Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
    icon: 'tv';
  };
  attributes: {
    ctaButtons: Schema.Attribute.Component<'shared.cta-button', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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
    items: Schema.Attribute.Component<'sections.testimonial-item', true>;
  };
}

export interface SectionsTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_blocks';
  info: {
    displayName: 'Text Block';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
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
      'sections.cta-banner': SectionsCtaBanner;
      'sections.featured-list': SectionsFeaturedList;
      'sections.hero': SectionsHero;
      'sections.testimonial-item': SectionsTestimonialItem;
      'sections.testimonials': SectionsTestimonials;
      'sections.text-block': SectionsTextBlock;
      'shared.cta-button': SharedCtaButton;
    }
  }
}
