import { Component, Input } from '@angular/core';
import { createEventid } from './event.utils';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CalendarOptions,
  EventApi,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/common';
import { Task } from './interface/task.interface';
declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'QATeam';
  taskForm!: FormGroup;
  materiaForm!: FormGroup;
  creating: Boolean = false;
  calendarVisible = true;
  materias = <any>[];
  selectInfo: any;
  selectedTask: any;
  tasks: any;
  updating: any;
  loading: Boolean = false;
  taskInfo!: Task;
  clickInfo: any;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      // ? flechas para desplazarse en el calendario
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEventRows: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };
  currentEvents: EventApi[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.materiaForm = this.fb.group({
      materia: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      color: new FormControl('', [Validators.required]),
    });
    this.taskForm = this.fb.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(800),
      ]),
      color: new FormControl('', [Validators.required]),
      // reminderDate: new FormControl('', [Validators.required]),
    });
  }

  // ?Funcion que hara crear las tareas
  createTask() {
    console.log(this.taskForm.value);
    if (this.selectInfo) {
      this.handleDateSelect(this.selectInfo);
    }
    $('#createTask').modal('hide');
    this.taskForm.reset();
  }

  createMat() {
    this.creating = true;
    const materiaAdd = {
      materia: this.materiaForm.controls.materia.value,
      color: this.materiaForm.controls.color.value,
    };
    this.materias.push(materiaAdd);
    this.creating = false;
    this.materiaForm.reset();
  }

  // ? eventos invalidos
  isInvalidInput(input: FormControl) {
    return input.touched && input.invalid ? true : false;
  }

  getInput(input: any) {
    return this.taskForm.get(input) as FormControl;
  }

  // ? hacemos visible o no todo el calendario
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  // ? hacemos visibles los fines de semana o no
  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  elimnMateria(numMateria: Number) {
    this.materias.splice(numMateria, 1);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    $('#createTask').modal('show');
    this.selectInfo = selectInfo;
    const calendarApi = selectInfo.view.calendar;
    // ? Limpiamos la fecha de la seleccion
    calendarApi.unselect();
    const taskInfo = this.taskForm.value;
    // ?le pasamos la info para que se pueda crear el nuevo evento
    if (this.taskForm.valid) {
      calendarApi.addEvent({
        id: createEventid(),
        title: taskInfo.title,
        description: taskInfo.description,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        status: 'pending',
        color: taskInfo.color,
      });
    }
  }

  // ? eliminamos el veneto que a sido seleccionado con un modal
  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event.extendedProps.description);
    this.taskInfo = {
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      status: clickInfo.event.extendedProps.status,
    };
    this.clickInfo = clickInfo;
    $('#viewTask').modal('show');
    console.log(this.taskInfo);
    // if (confirm(` Deseas Eliminar el evento  '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }

    // this.selectedTask = this.tasks.filter(
    //   (task: any) => task._id === clickInfo.event._def.extendedProps._id
    // )[0];
    // if (this.selectedTask) {
    //   console.log('encontrado');

    //   $('#viewTask').modal('show');
    // } else {
    //   // console.log("No encontro coincidencia");
    // }
  }

  deleteTask() {
    this.clickInfo.event.remove();
    $('#viewTask').modal('hide');
  }

  getTasks(selectInfo?: DateSelectArg) {
    this.loading = true;
    // const InitialEvents:EventInput[] = resp
    this.tasks.forEach((task: any) => {
      const taskToAdd = {
        title: task.title,
        _id: task._id,
        start: task.reminderDate,
        allDay: true,

        color: task.status === 'incomplete' ? 'red' : 'green',
      };
      $('#loadingModal').modal('hide');
      // this.loading = false;
    });
    console.log(this.tasks);
  }

  markAsDone() {
    this.updating = true;
    this.getTasks();
    this.updating = false;
    $('#viewTask').modal('hide');
    // this.calendarOptions.events = this.calendarAPI.initialEventsMe(
    //   this.filters.status
    // );
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
}
