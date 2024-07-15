// components/CookieCheck.tsx
import dynamic from 'next/dynamic';

const ClientSideCookieCheck = dynamic(
  () => import('./clientCookieCheck'),
  { ssr: false }
);

const CookieCheck = () => {
  return <ClientSideCookieCheck />;
};

export default CookieCheck;