import fs from 'fs';
import path from 'path';

const CUSTOM_POST_TYPES_PATH = path.join(process.cwd(), 'src/data/custom_post_types.json');

const defaultPostTypes = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    slug: 'blog-post',
    description: 'Standard blog posts with custom fields.',
    icon: 'FileText',
    hasArchive: true,
    menuPosition: 5,
    fields: [
      { id: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { id: 'featured_image', label: 'Featured Image', type: 'image', required: true },
      { id: 'author_name', label: 'Author Name', type: 'text', required: false }
    ]
  },
  {
    id: 'package',
    name: 'Package',
    slug: 'package',
    description: 'Service packages or product bundles.',
    icon: 'ShoppingBag',
    hasArchive: true,
    menuPosition: 6,
    fields: [
      { id: 'price', label: 'Price', type: 'price', required: true },
      { id: 'features', label: 'Features List', type: 'textarea', required: false },
      { id: 'duration', label: 'Duration', type: 'text', required: false }
    ]
  },
  {
    id: 'service',
    name: 'Service',
    slug: 'service',
    description: 'Professional services offered.',
    icon: 'Settings',
    hasArchive: true,
    menuPosition: 7,
    fields: [
      { id: 'service_icon', label: 'Service Icon', type: 'image', required: false },
      { id: 'service_price', label: 'Starting Price', type: 'price', required: false },
      { id: 'service_rating', label: 'Rating', type: 'rating', required: false }
    ]
  }
];

if (!fs.existsSync(path.dirname(CUSTOM_POST_TYPES_PATH))) {
  fs.mkdirSync(path.dirname(CUSTOM_POST_TYPES_PATH), { recursive: true });
}

if (!fs.existsSync(CUSTOM_POST_TYPES_PATH)) {
  fs.writeFileSync(CUSTOM_POST_TYPES_PATH, JSON.stringify({ postTypes: defaultPostTypes }, null, 2));
  console.log('Default post types created.');
} else {
  const data = JSON.parse(fs.readFileSync(CUSTOM_POST_TYPES_PATH, 'utf-8'));
  const existingSlugs = data.postTypes.map((pt: any) => pt.slug);
  const newPostTypes = defaultPostTypes.filter(pt => !existingSlugs.includes(pt.slug));
  
  if (newPostTypes.length > 0) {
    data.postTypes.push(...newPostTypes);
    fs.writeFileSync(CUSTOM_POST_TYPES_PATH, JSON.stringify(data, null, 2));
    console.log('Added new default post types.');
  } else {
    console.log('Default post types already exist.');
  }
}
