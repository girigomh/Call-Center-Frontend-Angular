import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByUserType',
})
export class FilterByUserTypePipe implements PipeTransform {
  transform(contacts: any[], userType: string[]): any[] {
    // console.log('Contacts:', contacts);
    // console.log('userType:', userType);

    if (
      !contacts ||
      !Array.isArray(contacts) ||
      !userType ||
      !Array.isArray(userType)
    ) {
      console.log('Returning empty array due to invalid input.');
      return [];
    }

    const filteredContacts = contacts.filter((contact) =>
      userType.includes(contact.profile.name)
    );

    // console.log('Filtered Contacts:', filteredContacts);

    return filteredContacts;
  }
}
