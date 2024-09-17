import { Component,Input,Output,EventEmitter  } from '@angular/core';
import { Room } from '../models/room.model';
@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  @Input() room: Room | undefined;
  @Output() update = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onUpdate(id: number | undefined): void {
    console.log(id);
    if (id !== undefined) {
      this.update.emit(id);
    }
  }

  onDelete(id: number | undefined): void {
    if (id !== undefined) {
      this.delete.emit(id);
    }
  }
}