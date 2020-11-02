import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../app/services/api.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [ApiService],
})
export class HomePage implements OnInit {
  invoices;
  street = "";

  constructor(private _apiService: ApiService, public navCtrl: NavController, public loadingController: LoadingController, public alertController: AlertController, public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    this._apiService.getFacturas(this.street).subscribe(
      (response) => {
        this.invoices = response;
        for (let i = 0; i < this.invoices.length; i++) {
          this.invoices[i].nUMDOC = parseInt(this.invoices[i].nUMDOC)
          this.invoices[i].oRDENRUTA = parseInt(this.invoices[i].oRDENRUTA)
        }
        console.log(this.invoices);

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

  async onClick(id, street, pob, cp) {
/*     window.open("https://www.google.com/maps?daddr=" + street + " " + pob + " " + " " + cp);
    id = parseInt(id);
    this.navCtrl.navigateForward('/home/signature/' + id.toString()); */

    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Como llegar',
        icon: 'navigate-outline',
        handler: () => {
          window.open("https://www.google.com/maps?daddr=" + street + " " + pob + " " + " " + cp);
        }
      }, {
        text: 'Firmar documento',
          icon: 'clipboard',
        handler: () => {
          id = parseInt(id);
          this.navCtrl.navigateForward('/home/signature/' + id.toString()); 
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  search(q: string) {
    this.street = q;
    this.load();
    console.log(this.invoices);
  }

  doRefresh(event) {
    this.street = "";
    this.load();
    event.target.complete();
  }
}
