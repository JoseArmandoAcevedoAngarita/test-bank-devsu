import { TestBed } from '@angular/core/testing';
import { FilterAndPaginatePipe } from './filter-and-paginate.pipe';

describe('FilterAndPaginatePipe', () => {
  let pipe: FilterAndPaginatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterAndPaginatePipe]
    });
    pipe = TestBed.inject(FilterAndPaginatePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter items based on the filter string', () => {
    const items = [
      { name: 'Test 1', description: 'Description 1' },
      { name: 'Test 2', description: 'Description 2' },
      { name: 'Sample', description: 'Description 3' }
    ];
    const filter = 'Test';
    const pageSize = 10;
    const pageIndex = 1;

    const result = pipe.transform(items, filter, pageSize, pageIndex);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { name: 'Test 1', description: 'Description 1' },
      { name: 'Test 2', description: 'Description 2' }
    ]);
  });

  it('should paginate items based on the pageSize and pageIndex', () => {
    const items = [
      { name: 'Item 1', description: 'Description 1' },
      { name: 'Item 2', description: 'Description 2' },
      { name: 'Item 3', description: 'Description 3' },
      { name: 'Item 4', description: 'Description 4' },
      { name: 'Item 5', description: 'Description 5' },
      { name: 'Item 6', description: 'Description 6' }
    ];
    const filter = '';
    const pageSize = 2;
    const pageIndex = 2; // Page index is 1-based

    const result = pipe.transform(items, filter, pageSize, pageIndex);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { name: 'Item 3', description: 'Description 3' },
      { name: 'Item 4', description: 'Description 4' }
    ]);
  });

  it('should filter and paginate items', () => {
    const items = [
      { name: 'Test 1', description: 'Description 1' },
      { name: 'Test 2', description: 'Description 2' },
      { name: 'Sample', description: 'Description 3' },
      { name: 'Test 3', description: 'Description 4' }
    ];
    const filter = 'Test';
    const pageSize = 2;
    const pageIndex = 2; // Page index is 1-based

    const result = pipe.transform(items, filter, pageSize, pageIndex);
    expect(result.length).toBe(1);
    expect(result).toEqual([
      { name: 'Test 3', description: 'Description 4' }
    ]);
  });

  it('should return all items if no filter is provided', () => {
    const items = [
      { name: 'Test 1', description: 'Description 1' },
      { name: 'Test 2', description: 'Description 2' },
      { name: 'Sample', description: 'Description 3' }
    ];
    const filter = '';
    const pageSize = 10;
    const pageIndex = 1;

    const result = pipe.transform(items, filter, pageSize, pageIndex);
    expect(result.length).toBe(3);
    expect(result).toEqual(items);
  });

  it('should return an empty array if items is null or undefined', () => {
    const filter = 'Test';
    const pageSize = 10;
    const pageIndex = 1;

    const resultNull = pipe.transform(null, filter, pageSize, pageIndex);
    expect(resultNull).toEqual([]);

    const resultUndefined = pipe.transform(undefined, filter, pageSize, pageIndex);
    expect(resultUndefined).toEqual([]);
  });

  it('should handle filterItems function correctly', () => {
    const items = [
      { name: 'Test 1', description: 'Description 1' },
      { name: 'Test 2', description: 'Description 2' },
      { name: 'Sample', description: 'Description 3' }
    ];
    const filter = 'Test';

    const result = pipe.filterItems(items, filter);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { name: 'Test 1', description: 'Description 1' },
      { name: 'Test 2', description: 'Description 2' }
    ]);
  });

  it('should handle paginate function correctly', () => {
    const items = [
      { name: 'Item 1', description: 'Description 1' },
      { name: 'Item 2', description: 'Description 2' },
      { name: 'Item 3', description: 'Description 3' },
      { name: 'Item 4', description: 'Description 4' },
      { name: 'Item 5', description: 'Description 5' }
    ];
    const pageSize = 2;
    const pageIndex = 2; // Page index is 1-based

    const result = pipe.paginate(items, pageSize, pageIndex);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { name: 'Item 3', description: 'Description 3' },
      { name: 'Item 4', description: 'Description 4' }
    ]);
  });
});
