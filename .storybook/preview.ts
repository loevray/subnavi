import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';
import { withMainLayout } from '../.storybook/decorators';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  decorators: [withMainLayout],
};

export default preview;
