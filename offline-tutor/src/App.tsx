import { useEffect, useState } from 'react';
import { data } from './api';

export default function App() {
  const [titles, setTitles] = useState<string[]>([]);
  useEffect(() => {
    data.getModules().then(m => setTitles(m.map(x => x.title.en)));
  }, []);
  return <div style={{ padding: 20 }}>{titles.join(' | ') || 'Loading...'}</div>;
}