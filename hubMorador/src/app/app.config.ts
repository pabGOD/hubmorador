import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// 1. Importar as ferramentas de localização
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// 2. Registar o idioma português na sua aplicação
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // 3. Definir 'pt-BR' como o ID de localidade padrão
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
