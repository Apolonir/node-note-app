// notes.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { NotesService } from './notes.service';
import { createNoteSchema, editNoteSchema } from './note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(): any[] {
    return this.notesService.getAllNotes();
  }

  @Get('stats')
  getStats(): any {
    return this.notesService.getStatsByCategory();
  }

  @Get(':id')
  getNoteById(@Param('id') id: string): any {
    return this.notesService.getNoteById(+id);
  }

  @Post()
  async createNote(@Body() note: any): Promise<any> {
    const validatedNote = await createNoteSchema.validate(note, { abortEarly: false });
    return this.notesService.createNote(validatedNote);
  }

  @Patch(':id')
  async editNote(
    @Param('id') id: string,
    @Body() updatedNote: any,
  ): Promise<any> {
    const { ...validatedNote } = await editNoteSchema.validate(updatedNote, { abortEarly: false });
    return this.notesService.editNote(+id, validatedNote);
  }

  @Delete(':id')
  removeNoteById(@Param('id') id: string): void {
    this.notesService.removeNoteById(+id);
  }
}
