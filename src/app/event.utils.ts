import { EventInput } from '@fullcalendar/angular';
let eventGuid = 0;

export const INITIAL_EVENTS: EventInput[] = [
  // ? ejemplo de un evento
  {
    active: true,
    status: 'incomplete',
    reference: {
      companyID: { _id: '35132103' },
      _id: '35181',
    },
    id: createEventid(),
    title: 'All-day event',
    start: '2021-06-21T23:33:41.662Z',
  },
  {
    active: true,
    status: 'incomplete',
    reference: {
      companyID: { _id: '35132103' },
      _id: '35181',
    },
    id: createEventid(),
    title: 'All-day event',
    start: '2021-10-21T23:33:41.662Z',
  },
];

// ? creamos un id sencillo para identificar nuestros eventos
export function createEventid() {
  return String(eventGuid++);
}
