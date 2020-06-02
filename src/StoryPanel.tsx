/* jslint browser: true */
/* global window */

import React from 'react';
import { API } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';
import {
  SyntaxHighlighter,
  SyntaxHighlighterProps,
  SyntaxHighlighterRendererProps,
  createSyntaxHighlighterElement,
} from '@storybook/components';
import { STORY_RENDERED } from '@storybook/core-events';

import { SourceBlock, LocationsMap } from '@storybook/source-loader';
import { Story } from '@storybook/api/dist/lib/stories';

const StyledStoryLink = styled(Link)<{ to: string; key: string }>(({ theme }) => ({
  display: 'block',
  textDecoration: 'none',
  borderRadius: theme.appBorderRadius,
  color: 'inherit',

  '&:hover': {
    background: theme.background.hoverable,
  },
}));

const SelectedStoryHighlight = styled.div(({ theme }) => ({
  background: theme.background.hoverable,
  borderRadius: theme.appBorderRadius,
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)<SyntaxHighlighterProps>(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
}));

const areLocationsEqual = (a: SourceBlock, b: SourceBlock): boolean =>
  a.startLoc.line === b.startLoc.line &&
  a.startLoc.col === b.startLoc.col &&
  a.endLoc.line === b.endLoc.line &&
  a.endLoc.col === b.endLoc.col;

interface StoryPanelProps {
  api: API;
}

interface SourceParams {
  source: string;
  locationsMap: LocationsMap;
}
export const StoryPanel: React.FC<StoryPanelProps> = ({ api }) => {
  const [state, setState] = React.useState<SourceParams & { currentLocation?: SourceBlock }>({
    source: 'loading source...',
    locationsMap: {},
  });

  const story: Story | undefined = api.getCurrentStoryData() as Story;
  const selectedStoryRef = React.useRef<HTMLDivElement>(null);

  const setStoryState = () => {
    if (story && window.document.querySelector('#storybook-preview-iframe')) {
      const compiledSource = (window.document.querySelector(
        '#storybook-preview-iframe'
      ) as any)?.contentDocument.querySelector('#root')
        ? (window.document.querySelector(
            '#storybook-preview-iframe'
          ) as any)?.contentDocument.querySelector('#root').innerHTML
        : '';
      const {
        parameters: {
          // @ts-ignore
          storySource: { locationsMap } = { locationsMap: {} },
        } = {},
      } = story;
      const currentLocation = locationsMap
        ? locationsMap[
            Object.keys(locationsMap).find((key: string) => {
              const sourceLoaderId = key.split('--');
              return story.id.endsWith(sourceLoaderId[sourceLoaderId.length - 1]);
            })
          ]
        : undefined;
      setState({ source: compiledSource, locationsMap, currentLocation });
    }
  };

  React.useEffect(() => setStoryState(), []);
  api.on(STORY_RENDERED, () => setStoryState());

  React.useEffect(() => {
    if (selectedStoryRef.current) {
      selectedStoryRef.current.scrollIntoView();
    }
  }, [selectedStoryRef.current]);

  const { source, locationsMap, currentLocation } = state;

  const createPart = ({ rows, stylesheet, useInlineStyles }: SyntaxHighlighterRendererProps) =>
    rows.map((node, i) =>
      createSyntaxHighlighterElement({
        node,
        stylesheet,
        useInlineStyles,
        key: `code-segement${i}`,
      })
    );

  const createStoryPart = ({
    rows,
    stylesheet,
    useInlineStyles,
    location,
    id,
    refId,
  }: SyntaxHighlighterRendererProps & { location: SourceBlock; id: string; refId?: string }) => {
    const first = location.startLoc.line - 1;
    const last = location.endLoc.line;

    const storyRows = rows.slice(first, last);
    const storySource = createPart({ rows: storyRows, stylesheet, useInlineStyles });
    const storyKey = `${first}-${last}`;

    if (currentLocation && areLocationsEqual(location, currentLocation)) {
      return (
        <SelectedStoryHighlight key={storyKey} ref={selectedStoryRef}>
          {storySource}
        </SelectedStoryHighlight>
      );
    }
    return (
      <StyledStoryLink to={refId ? `/story/${refId}_${id}` : `/story/${id}`} key={storyKey}>
        {storySource}
      </StyledStoryLink>
    );
  };

  const createParts = ({ rows, stylesheet, useInlineStyles }: SyntaxHighlighterRendererProps) => {
    const parts = [];
    let lastRow = 0;

    Object.keys(locationsMap).forEach((key) => {
      const location = locationsMap[key];
      const first = location.startLoc.line - 1;
      const last = location.endLoc.line;
      const { kind, refId } = story;
      // source loader ids are different from story id
      const sourceIdParts = key.split('--');
      const id = api.storyId(kind, sourceIdParts[sourceIdParts.length - 1]);
      const start = createPart({ rows: rows.slice(lastRow, first), stylesheet, useInlineStyles });
      const storyPart = createStoryPart({ rows, stylesheet, useInlineStyles, location, id, refId });

      parts.push(start);
      parts.push(storyPart);

      lastRow = last;
    });

    const lastPart = createPart({ rows: rows.slice(lastRow), stylesheet, useInlineStyles });

    parts.push(lastPart);

    return parts;
  };

  const lineRenderer = ({
    rows,
    stylesheet,
    useInlineStyles,
  }: SyntaxHighlighterRendererProps): React.ReactNode => {
    // because of the usage of lineRenderer, all lines will be wrapped in a span
    // these spans will receive all classes on them for some reason
    // which makes colours casecade incorrectly
    // this removed that list of classnames
    const myrows = rows.map(({ properties, ...rest }) => ({
      ...rest,
      properties: { className: [] },
    }));

    if (!locationsMap || !Object.keys(locationsMap).length) {
      return createPart({ rows: myrows, stylesheet, useInlineStyles });
    }

    const parts = createParts({ rows: myrows, stylesheet, useInlineStyles });

    return <span>{parts}</span>;
  };
  return (
    <StyledSyntaxHighlighter
      language="jsx"
      showLineNumbers
      renderer={lineRenderer}
      format={false}
      copyable={false}
      padded
    >
      {source}
    </StyledSyntaxHighlighter>
  );
};
