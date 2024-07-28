import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAndPaginate',
  standalone: true
})
export class FilterAndPaginatePipe implements PipeTransform {

  transform(items: any[] | null | undefined, filter: string, pageSize: number, pageIndex: number): any[] {
    if (!items || !Array.isArray(items)) return [];
    if (!filter) return this.paginate(items, pageSize, pageIndex);

    const filteredItems = this.filterItems(items, filter);

    return this.paginate(filteredItems, pageSize, pageIndex);
  }

  paginate(items: any[], pageSize: number, pageIndex: number): any[] {
    const startIndex = (pageIndex - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }

  filterItems(items: any[], filter: string): any[] {
    if (!filter) return items;

    return items.filter(item => 
      Object.keys(item).some(key => 
        item[key].toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }
}
