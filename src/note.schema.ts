// note.schema.ts
import * as yup from 'yup';

export const createNoteSchema = yup.object({
  name: yup.string().required(),
  date: yup.string().required().matches(/\d{4}-\d{2}-\d{2}/, 'Invalid date format'),
  category: yup.string().required(),
  content: yup.string().required(),
  archived: yup.boolean().required(),
});

export const editNoteSchema = yup.object({
  name: yup.string(),
  date: yup.string().matches(/\d{4}-\d{2}-\d{2}/, 'Invalid date format'),
  category: yup.string(),
  content: yup.string(),
  archived: yup.boolean(),
});
