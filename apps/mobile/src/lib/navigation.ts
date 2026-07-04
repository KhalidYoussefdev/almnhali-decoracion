import { router } from 'expo-router';

export function openAR(productId: string) {
  router.push({
    pathname: '/ar/[id]',
    params: { id: productId },
  });
}