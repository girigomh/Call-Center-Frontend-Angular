import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "customDate",
})
export class CustomDatePipe implements PipeTransform {
  transform(value: any): string {
    if (!Array.isArray(value)) {
      return "Invalid date format";
    }

    const [year, month, day, hour, minute, second] = value.map(Number);

    // Format the date as desired (e.g., "June 27, 2023 14:22:56")
    const formattedDate = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second
    ).toLocaleString();

    return formattedDate;
  }
}
