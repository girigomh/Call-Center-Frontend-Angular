import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';

function fixLocalStorage(): void {
  var reload = false;
  if(localStorage.getItem('country')===undefined 
    || localStorage.getItem('country')==null 
    || localStorage.getItem('locale')===undefined
    || localStorage.getItem('locale')==null)
  {
    localStorage.setItem('country', 'at');
    localStorage.setItem('locale', 'de');

    reload = true;
  }


  if(reload){
    location.reload();
  }
}

if ( environment.production )
{
    enableProdMode();
}

fixLocalStorage();

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
