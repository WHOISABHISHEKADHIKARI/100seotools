import HomePageClient from './HomePageClient';
import { getAllToolsMeta } from '../tools';

export default function HomePage() {
  const tools = getAllToolsMeta().map((tool) => ({ ...tool, type: 'tool' }));

  return <HomePageClient initialTools={tools} />;
}
