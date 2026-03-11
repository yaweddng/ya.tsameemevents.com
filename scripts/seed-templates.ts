import fs from 'fs';
import path from 'path';

const THEME_BUILDER_PATH = path.join(process.cwd(), 'src/data/theme_builder.json');

const defaultTemplates = [
  {
    id: 'search-results',
    type: 'search',
    name: 'Search Results Template',
    config: {
      layout: 'grid',
      columns: 3,
      showSidebar: true,
      title: 'Search results for: {search_term}'
    },
    conditions: ['search-results'],
    status: 'Active'
  },
  {
    id: '404-page',
    type: '404',
    name: '404 Error Page',
    config: {
      title: 'Page Not Found',
      message: 'The page you are looking for might have been removed or is temporarily unavailable.',
      buttonText: 'Back to Home',
      buttonUrl: '/'
    },
    conditions: ['404-page'],
    status: 'Active'
  }
];

if (fs.existsSync(THEME_BUILDER_PATH)) {
  const data = JSON.parse(fs.readFileSync(THEME_BUILDER_PATH, 'utf-8'));
  const existingTypes = data.templates.map((t: any) => t.type);
  const newTemplates = defaultTemplates.filter(t => !existingTypes.includes(t.type));
  
  if (newTemplates.length > 0) {
    data.templates.push(...newTemplates);
    fs.writeFileSync(THEME_BUILDER_PATH, JSON.stringify(data, null, 2));
    console.log('Added new default templates.');
  } else {
    console.log('Default templates already exist.');
  }
}
