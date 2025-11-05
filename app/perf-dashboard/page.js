import PerfDashboardClient from '../../components/PerfDashboardClient';

export const metadata = {
  title: 'Performance Dashboard | 100 SEO Tools',
  description: 'Real-time LCP/FCP/TTI monitoring with minute-level sampling.',
};

export default function PerfDashboard() {
  return <PerfDashboardClient />;
}