import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../app/services/api.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [ApiService],
})
export class HomePage implements OnInit {
  invoices;

  constructor(private _apiService: ApiService, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    this._apiService.getFacturas().subscribe(
      (response) => {
        console.info(response);
        this.invoices = response;
        this.loadingController.dismiss();
      }, async (error) => {
        console.error(error);
        this.loadingController.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          subHeader: 'Parece que hay problemas ',
          message: 'Error al cargar los albaranes por favor llame a servicio técnico 🤓',
          buttons: ['OK']
        });
        await alert.present();
      }
    )
  }

  onClick(id) {
    id = parseInt(id);
    console.log(id);

    this.navCtrl.navigateForward('/home/signature/' + id.toString());
  }

  doRefresh(event) {
    this.load();
    event.target.complete();
  }

}
