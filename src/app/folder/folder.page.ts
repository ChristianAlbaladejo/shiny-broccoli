import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../app/services/api.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  providers: [ApiService],
})
export class FolderPage implements OnInit {
  facturas;
  open;

  constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController, public actionSheetController: ActionSheetController, private authService: AuthenticationService,
    private router: Router) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    (await this._apiService.getFacturasserv()).subscribe(
      (response) => {
        this.facturas = response;

        console.log(this.facturas);

        this.loadingController.dismiss();
      }, async (error) => {
        console.error(error);
        this.loadingController.dismiss();
        if (error.status === 401) {
          this.logout();
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'Parece que hay problemas ',
            message: 'Error al cargar los albaranes por favor llame a servicio técnico 🤓',
            buttons: ['OK']
          });
          await alert.present();
        }
      }
    )
  }

  async openPdf(nUMDOC) {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    (await this._apiService.getPdf(nUMDOC)).subscribe(
      (response) => {
        console.log(response);
        this.open = response.url
        this.loadingController.dismiss();
        var iframe = "<iframe height='100%' width='100%' frameborder='0' allowfullscreen webkitallowfullscreen mozallowfullscreen src='" + this.open + "'></iframe>"
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
      }, async (error) => {
        console.error(error);
        this.loadingController.dismiss();
        if (error.status === 401) {
          this.logout();
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'Parece que hay problemas ',
            message: 'Error al cargar los albaranes por favor llame a servicio técnico 🤓',
            buttons: ['OK']
          });
          await alert.present();
        }
      }
    )
    this.loadingController.dismiss();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
