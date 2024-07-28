import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAndPaginate',
  standalone: true
})
export class FilterAndPaginatePipe implements PipeTransform {

  transform(items: any[], filter: string, pageSize: number, pageIndex: number): any[] {
    if (!items) return [];
    if (!filter) return this.paginate(items, pageSize, pageIndex);

    const filteredItems = items.filter(item => 
      Object.keys(item).some(key => 
        item[key].toString().toLowerCase().includes(filter.toLowerCase())
      )
    );

    return this.paginate(filteredItems, pageSize, pageIndex);
  }

  private paginate(items: any[], pageSize: number, pageIndex: number): any[] {
    const startIndex = pageIndex * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }

}
