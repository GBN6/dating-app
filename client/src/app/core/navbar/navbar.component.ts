import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../shared/components/icons/icon.component';
import { NAVBAR_CONFIG } from './navbar.const';
import { LinkComponent } from '../../shared/components/link/link.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  imports: [IconComponent, LinkComponent],
})
export class NavbarComponent {
  public readonly navbarConfig = NAVBAR_CONFIG;
}
