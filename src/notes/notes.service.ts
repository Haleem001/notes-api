import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  private toObjectId(userId: string) {
    return new Types.ObjectId(userId);
  }

  async create(userId: string, dto: CreateNoteDto) {
    const note = await this.noteModel.create({
      ...dto,
      content: dto.content ?? '',
      userId: this.toObjectId(userId),
    });

    return note;
  }

  async findAllByUser(userId: string) {
    return this.noteModel
      .find({ userId: this.toObjectId(userId) })
      .sort({ createdAt: -1 });
  }
  

  async update(userId: string, noteId: string, dto: UpdateNoteDto) {
    const note = await this.noteModel.findOneAndUpdate(
      { _id: noteId, userId: this.toObjectId(userId) },
      dto,
      { new: true },
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async delete(userId: string, noteId: string) {
    const result = await this.noteModel.findOneAndDelete({
      _id: noteId,
      userId: this.toObjectId(userId),
    });

    if (!result) {
      throw new NotFoundException('Note not found');
    }

    return { success: true };
  }
}
