import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TargetGroupService } from 'app/services/target-groups.service';

@Component({
  selector: 'app-target-groups-select',
  templateUrl: './target-groups-select.component.html',
  styleUrls: ['./target-groups-select.component.css']
})
export class TargetGroupsSelectComponent implements OnInit, OnChanges {

  @Input()
  public selected: string = "";
  public targetGroupInput: string = "";

  @Output()
  public change: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public targetGroupService: TargetGroupService
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.selected) {
      this.targetGroupInput = this.selected || "";
    }
  }

  ngOnInit(): void {

  }

  onChange(value: string) {
    if (value) {
      this.change.emit(value);
    }
  }
}
