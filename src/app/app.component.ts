import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app-dropmessage';

  constructor() {
    this.configureStatusBar();
  }

  async configureStatusBar() {
    // Torna a barra de status branca com texto escuro
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setStyle({ style: Style.Light }); // Define texto escuro
  }
}
