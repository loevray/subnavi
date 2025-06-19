import { JSX, ReactNode, Suspense } from 'react';
import { ReactRenderer, type Decorator } from '@storybook/nextjs-vite';
import { MainLayout } from '../src/app/layout';
import { PartialStoryFn } from 'storybook/internal/csf';

/**
 * This decorator (rscDecorator) is used to prevent infinite re-renders of
 * rsc pages.
 *
 * See https://github.com/storybookjs/storybook/issues/30317#issuecomment-2615462131
 *
 * Rewritten to be compatible with Storybook 9
 */

let PrevStory: PartialStoryFn<ReactRenderer, object> | null = null;
let StoryPromise: ReactNode = null;
let promised = false;

const StoryPromiseWrapper = ({
  Story,
}: {
  Story: Parameters<Decorator<object>>[0];
}): ReactNode => {
  if (PrevStory !== Story) {
    promised = false;
    PrevStory = Story;
  }

  const storyObj: JSX.Element = Story();
  return {
    ...storyObj,
    type: (...args) => {
      const t = storyObj.type(...args);
      return {
        ...t,
        type: (...args) => {
          if (!promised) {
            StoryPromise = t
              .type(...args)
              .catch((err: unknown) => {
                throw err;
              })
              .finally(() => {
                promised = true;
              });
          }
          return StoryPromise;
        },
      };
    },
  };
};

export const rscDecorator: Decorator<object> = (Story) => {
  return (
    <Suspense>
      <StoryPromiseWrapper Story={Story} />
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
