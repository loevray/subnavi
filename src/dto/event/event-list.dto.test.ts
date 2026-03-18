import { describe, expect, it } from 'vitest';

import { EventListRequestDto } from './event-list.dto';
import { SearchKeywordTextDto } from './shared-event.dto';

describe('SearchKeywordTextDto', () => {
  it('normalizes repeated whitespace', () => {
    const result = SearchKeywordTextDto.safeParse('  comic   world  ');

    expect(result.success).toBe(true);
    expect(result.success && result.data).toBe('comic world');
  });

  it('rejects query operator characters that can break the PostgREST filter', () => {
    const result = SearchKeywordTextDto.safeParse('anime,festival');

    expect(result.success).toBe(false);
  });
});

describe('EventListRequestDto', () => {
  it('accepts a normalized keyword', () => {
    const result = EventListRequestDto.safeParse({ keyword: '  comic   world  ' });

    expect(result.success).toBe(true);
    expect(result.success && result.data.keyword).toBe('comic world');
  });

  it('rejects invalid keyword input instead of passing it to the query layer', () => {
    const result = EventListRequestDto.safeParse({ keyword: '(anime' });

    expect(result.success).toBe(false);
  });
});
