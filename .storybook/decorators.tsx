import { Suspense } from 'react';
import { type Decorator } from '@storybook/nextjs-vite';
import { MainLayout } from '../src/app/layout';

export const rscDecorator: Decorator = (Story) => {
  return (
    <Suspense>
      <Story />
    </Suspense>
  );
};

export const withMainLayout: Decorator = (Story) => {
  return (
    <MainLayout>
      <Story />
    </MainLayout>
  );
};
