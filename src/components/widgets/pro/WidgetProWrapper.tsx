import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BadgeTitle } from './BadgeTitle';
import { AdvancedTitle } from './AdvancedTitle';
import { Subheading } from './Subheading';
import { CTAButton } from './CTAButton';
import { Carousel } from './Carousel';
import { FormWidget } from './FormWidget';
import { IconList } from './IconList';

interface WidgetProWrapperProps {
  type: string;
  config: any;
  seo?: {
    title?: string;
    description?: string;
  };
  schema?: any;
}

export const WidgetProWrapper: React.FC<WidgetProWrapperProps> = ({
  type,
  config,
  seo,
  schema
}) => {
  const renderWidget = () => {
    switch (type) {
      case 'badge_title': return <BadgeTitle {...config} />;
      case 'advanced_title': return <AdvancedTitle {...config} />;
      case 'subheading': return <Subheading {...config} />;
      case 'cta_button': return <CTAButton {...config} />;
      case 'carousel': return <Carousel {...config} />;
      case 'form': return <FormWidget {...config} />;
      case 'icon_list': return <IconList {...config} />;
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        {seo?.title && <title>{seo.title}</title>}
        {seo?.description && <meta name="description" content={seo.description} />}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>
      
      <div className="widget-pro-container">
        {renderWidget()}
      </div>
    </>
  );
};
