import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarComponent } from "./core/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, NavbarComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly httpClient = inject(HttpClient);
  public users: Observable<any[]> = this.httpClient.get<any[]>('https://localhost:5001/api/users');

  // ngOnInit() {
  //   this.httpClient.get('https://localhost:5001/api/users').subscribe({
  //     next: () => {},
  //     error: (error) => console.log('Error:', error),
  //     complete: () => console.log('request complete'),
  //   });
  // }
}
