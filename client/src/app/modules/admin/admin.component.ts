import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UserManagmentComponent } from "./components/user-managment/user-managment.component";
import { PhotoManagementComponent } from "./components/photo-managment/photo-managment.component";

@Component({
	selector: 'app-admin',
	imports: [MatTabsModule, UserManagmentComponent, PhotoManagementComponent],
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {}
