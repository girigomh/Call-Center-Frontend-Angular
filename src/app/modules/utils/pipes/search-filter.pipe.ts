import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any[], input: any): any[] {
    if (input) {
      return value;
    } else {
      return value;
    }
  }

}
