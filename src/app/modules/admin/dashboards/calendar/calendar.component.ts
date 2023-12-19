import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import {
  subDays,
  addDays,
  startOfDay,
  endOfDay,
  isSameDay,
  addMonths,
  subMonths,
  endOfMonth,
  addHours,
  isSameMonth,
} from 'date-fns';
import { CalendarView } from 'angular-calendar';
// import { EventColor } from './event-color';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarService } from './calendar.service';
import { colors } from './event-color';
import { Subject } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  selectedColor: any = colors.red;
  newEventTitle: string = '';
  newEventStart: Date;
  bookmarked: boolean;
  newEventEnd: Date;
  weekStartsOn = DAYS_OF_WEEK.MONDAY
  showAddEventForm: boolean = false;
  addedEvents: { title: string; color: string }[] = [];
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  currentView: CalendarView = CalendarView.Month;
  editingEvent: CalendarEvent | null = null;
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private http: HttpClient,
    private calendarService: CalendarService
  ) { }

  ngOnInit(): void {
    // localStorage.setItem('events', JSON.stringify(this.events));
    moment.updateLocale('en', {
      week: {
        dow: 1, // set start of week to monday instead
        doy: 0,
      },
    });
    const storedEvents: any[] = JSON.parse(localStorage.getItem('appointmentData'));
    console.log(storedEvents)
    if (storedEvents) {
      storedEvents.map((event, index) => {
        let modifiedEvent: CalendarEvent = {
          title: event.topic,
          start: new Date(event?.startDate.split(':')[0].split('T')[0] + 'T' + event.startTime),
          end: new Date(event?.endDate.split(':')[0].split('T')[0] + 'T' + event.endTime)
        }
        // console.log(new Date(event?.startDate.split(':')[0].split('T')[0] + 'T' + event.startTime), "appointemtnData", event)
        this.events.push(modifiedEvent)
      })
      // this.events = JSON.parse(storedEvents);
    } else {
      this.events = [{
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: { ...colors.red },
    allDay: true,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    draggable: true,
  },
  {
    start: startOfDay(new Date()),
    title: 'An event with no end date',
    color: { ...colors.yellow },
  },
  {
    start: subDays(endOfMonth(new Date()), 3),
    end: addDays(endOfMonth(new Date()), 3),
    title: 'A long event that spans 2 months',
    color: { ...colors.blue },
    allDay: true,
  },
  {
    start: addHours(startOfDay(new Date()), 2),
    end: addHours(new Date(), 2),
    title: 'A draggable and resizable event',
    color: { ...colors.yellow },
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    draggable: true,
        },]
    }

    console.log(this.events)

    // for (let i = 0; i < 12; i++) {
    //   const startOfMonth = startOfDay(addMonths(this.viewDate, i));
    //   const endOfMonth = endOfDay(addMonths(this.viewDate, i));
    //   const monthName = startOfMonth.toLocaleDateString('default', {
    //     month: 'long',
    //   });

    //   this.events.push({
    //     title: monthName,
    //     start: startOfMonth,
    //     end: endOfMonth,
    //   });
    // }
  }
  // Event handlers
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date)
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    // Update event in your data store or make an API call to update it on the server
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  goToToday(): void {
    this.viewDate = new Date();
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'Sample Event',
        start: startOfDay(moment().toDate()),
        end: endOfDay(moment().add(2, 'hours').toDate()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    localStorage.setItem('events', JSON.stringify(this.events))
    // this.showAddEventForm = true;
  }

  selectColor(color: string) {
    this.selectedColor = colors[color];
  }

  toggleBookmark(event: CalendarEvent): void {
    console.log('Event:', event);
    // if (event?.bookmarked) {
    //   event.bookmarked = !event.bookmarked;
    // }
  }

  saveEvent(): void {
    const newEvent: CalendarEvent = {
      title: this.newEventTitle,
      start: this.newEventStart,
      end: this.newEventEnd,
      color: this.selectedColor,
      // bookmarked: false,
    };
    console.log(this.newEventStart)
    this.events.push(newEvent)
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    return
    this.calendarService.postEvent(newEvent).subscribe(
      (response) => {
        console.log('Event posted successfully:', response);
        this.events.push(newEvent);

        this.addedEvents.push({
          title: this.newEventTitle,
          color: this.selectedColor,
          // bookmarked: false,
          // start: this.newEventStart,
          // end: this.newEventEnd,
        });
        this.newEventTitle = '';
        this.newEventStart = null;
        this.newEventEnd = null;
        this.selectedColor = '';
        // this.bookmarked = true;
        console.log(newEvent);
        // Hide the add event form
        this.showAddEventForm = false;
      },
      (error) => {
        console.error('Error posting event:', error);
      }
    );
  }

  editEvent(event: CalendarEvent): void {
    this.editingEvent = event;
  }
  saveEditedEvent(): void {
    if (this.editingEvent) {
      const index = this.events.findIndex(
        (event) => event === this.editingEvent
      );
      if (index !== -1) {
        this.events[index] = this.editingEvent;
        localStorage.setItem('events', JSON.stringify(this.events));
        this.editingEvent = null;
      }
    }
  }
  cancelEdit(): void {
    this.editingEvent = null;
  }

  cancelEvent(): void {
    // Reset the form and hide it
    this.resetAddEventForm();
  }

  resetAddEventForm(): void {
    this.showAddEventForm = false;
    this.newEventTitle = '';
    this.newEventStart = null;
    this.newEventEnd = null;
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
