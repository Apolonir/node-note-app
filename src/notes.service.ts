import { Injectable } from '@nestjs/common';
import { createNoteSchema, editNoteSchema } from './note.schema';
import { Note } from './note';
import { pick } from 'lodash';

@Injectable()
export class NotesService {
  private notes: any[] = [
    {
      id: 1,
      name: 'Meeting Notes',
      date: '2023-08-01',
      category: 'Work',
      content: 'Discussed project status and action items for the upcoming sprint.',
      archived: false,
    },
    {
      id: 2,
      name: 'Grocery List',
      date: '2023-08-02',
      category: 'Personal',
      content: 'Milk, eggs, bread, vegetables, and fruits.',
      archived: true,
    },
    {
      id: 3,
      name: 'Ideas for Vacation',
      date: '2023-08-03',
      category: 'Personal',
      content: 'Consider visiting the beach or mountains for the next vacation.',
      archived: false,
    },
    {
      id: 4,
      name: 'Project Proposal',
      date: '2023-08-04',
      category: 'Work',
      content: 'Outlined the scope, objectives, and budget for the new project.',
      archived: false,
    },
    {
      id: 5,
      name: 'Recipe: Spaghetti Bolognese',
      date: '2023-08-05',
      category: 'Cooking',
      content: 'Ingredients and step-by-step instructions to make delicious spaghetti bolognese.',
      archived: false,
    },
    {
      id: 6,
      name: 'Fitness Goals',
      date: '2023-08-06',
      category: 'Health',
      content: 'Plan for regular workouts and healthy eating habits.',
      archived: true,
    },
    {
      id: 7,
      name: 'Books to Read',
      date: '2023-08-07',
      category: 'Hobbies',
      content: 'List of books recommended by friends and colleagues.',
      archived: false,
    },
  ];

  getAllNotes(): Note[] {
    return this.notes;
  }

  getNoteById(id: number): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  createNote(note: Omit<Note, 'id'>): Note {
    const validatedNote: Note = createNoteSchema.validateSync(pick(note, Object.keys(createNoteSchema.fields)), { abortEarly: false });
    const newNote: Note = {
      ...validatedNote,
      id: this.getNextId(),
    };
    this.notes.push(newNote);
    return newNote;
  }

  editNote(id: number, updatedNote: Note): Note {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new Error('Note not found');
    }

    const existingNote: Note = this.notes[index];
    const mergedNote: Note = { ...existingNote, ...updatedNote };
    const validatedNote: Note = editNoteSchema.validateSync(pick(mergedNote, Object.keys(editNoteSchema.fields)), { abortEarly: false });
    this.notes[index] = { ...existingNote, ...validatedNote };
    return this.notes[index];
  }

  removeNoteById(id: number): void {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  private getNextId(): number {
    const lastNote = this.notes[this.notes.length - 1];
    return lastNote ? lastNote.id + 1 : 1;
  }

  getStatsByCategory(): any {
    const statsByCategory: Record<string, { archived: number; unarchived: number }> = {};

    this.notes.forEach((note) => {
      const { category, archived } = note;

      if (!statsByCategory[category]) {
        statsByCategory[category] = { archived: 0, unarchived: 0 };
      }

      if (archived) {
        statsByCategory[category].archived++;
      } else {
        statsByCategory[category].unarchived++;
      }
    });

    return statsByCategory;
  }
}