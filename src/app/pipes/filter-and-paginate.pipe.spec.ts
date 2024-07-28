import { FilterAndPaginatePipe } from './filter-and-paginate.pipe';

describe('FilterAndPaginatePipe', () => {
  let pipe: FilterAndPaginatePipe;

  beforeEach(() => {
    pipe = new FilterAndPaginatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty array if no items are provided', () => {
    expect(pipe.transform([], '', 5, 0)).toEqual([]);  // Cambiado de null a []
  });

  it('should return paginated items if no filter is provided', () => {
    const items = [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }, { name: 'Item 4' }, { name: 'Item 5' }, { name: 'Item 6' }];
    expect(pipe.transform(items, '', 2, 0)).toEqual([{ name: 'Item 1' }, { name: 'Item 2' }]);
    expect(pipe.transform(items, '', 2, 1)).toEqual([{ name: 'Item 3' }, { name: 'Item 4' }]);
    expect(pipe.transform(items, '', 2, 2)).toEqual([{ name: 'Item 5' }, { name: 'Item 6' }]);
  });

  it('should return filtered and paginated items if filter is provided', () => {
    const items = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' }, { name: 'Date' }, { name: 'Elderberry' }];
    expect(pipe.transform(items, 'a', 2, 0)).toEqual([{ name: 'Apple' }, { name: 'Banana' }]);
    expect(pipe.transform(items, 'a', 2, 1)).toEqual([{ name: 'Date' }]);
  });

  it('should return an empty array if no items match the filter', () => {
    const items = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' }];
    expect(pipe.transform(items, 'z', 5, 0)).toEqual([]);
  });

  it('should return items even if filter matches different cases', () => {
    const items = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' }];
    expect(pipe.transform(items, 'a', 5, 0)).toEqual([{ name: 'Apple' }, { name: 'Banana' }]);
    expect(pipe.transform(items, 'A', 5, 0)).toEqual([{ name: 'Apple' }, { name: 'Banana' }]);
  });
});
