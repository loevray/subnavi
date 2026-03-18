import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

// This applies Storybook preview annotations to the Vitest story environment.
setProjectAnnotations([projectAnnotations]);
