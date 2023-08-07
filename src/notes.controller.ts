import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { NotesService } from './notes.service';
import { createNoteSchema, editNoteSchema } from './note.schema';
import { Note } from './note';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(): Note[] {
    return this.notesService.getAllNotes();
  }

  @Get('stats')
  getStats(): Record<string, { archived: number; unarchived: number }> {
    return this.notesService.getStatsByCategory();
  }

  @Get(':id')
  getNoteById(@Param('id') id: string): Note | undefined {
    return this.notesService.getNoteById(+id);
  }

  @Post()
  async createNote( 
    @Body() note: Note
  ): Promise<Note> {
    const validatedNote = await createNoteSchema.validate(note, { abortEarly: false });

    return this.notesService.createNote(validatedNote);
  }

  @Patch(':id')
  async editNote(
    @Param('id') id: string,
    @Body() updatedNote: Note,
  ): Promise<Note> {
    const { ...validatedNote } = await editNoteSchema.validate(updatedNote, { abortEarly: false });
    return this.notesService.editNote(+id, validatedNote);
  }

  @Delete(':id')
  removeNoteById(@Param('id') id: string): void {
    this.notesService.removeNoteById(+id);
  }
}
