'use client';

import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/tauri';

export default function Greet() {
  const {
    data: greeting,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['greet'],
    queryFn: () => invoke<string>('greet', { name: 'Next.js' }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{greeting}</div>;
}
