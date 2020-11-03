import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { PdfViewer } from 'capacitor-pdf-viewer-plugin';
import { registerWebPlugin } from '@capacitor/core';
import { ApiService } from '../../../app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


registerWebPlugin(PdfViewer);

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
  providers: [ApiService],
})
export class SignaturePage implements OnInit {
  @ViewChild('signatureCanvas', { static: true }) signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    'canvasWidth': 350,
    'canvasHeight': 300,
    'backgroundColor': 'white',
  };

  ifIncidencia = "F";
  textIncidencia;
  nif;
  name;
  signature;
  albId;
  pdfFile;
  checked = "F";

  constructor(public navCtrl: NavController, private _apiService: ApiService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    this.albId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.albId);
    this._apiService.getPdf(this.albId).subscribe(
      (response) => {
        let data = "data:application/pdf;base64," + response.toString()
        console.log(data);
        this.pdfFile = data
        /* this.pdfFile = this.sanitizer.bypassSecurityTrustResourceUrl(data)
       console.log(this.pdfFile);  */
        this.loadingController.dismiss();
      }, async (error) => {
        this.loadingController.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          subHeader: 'Parece que hay problemas ',
          message: 'Error al cargar el albaran',
          buttons: ['OK']
        });
        await alert.present();
        this.navCtrl.navigateForward('/home');
      }
    )
  }
  drawStart() {
    console.log('drawStart');
  }

  drawComplete() {
    this.signature = this.signaturePad.toDataURL("image/jpeg", 0.5)
  }

  async send() {
    if (this.checked == "T" && this.signature  && this.name && this.nif) {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        translucent: true,
      });
      await loading.present();
      let body = [{
        "FAL_FIRMA": this.signature,
        "FAL_INCCHECK": this.ifIncidencia,
        "FAL_INCIDENCIA": this.textIncidencia,
        "FAL_NIF": this.nif,
        "FAL_NOMBRE": this.name,
        "FAL_VISTO": this.checked
      }]
      this.albId = this.albId;
      this._apiService.putAlbaran(body, this.albId).subscribe(
        async (response) => {
          this.loadingController.dismiss();
          this.navCtrl.navigateForward('/home');
          //toast
          const toast = await this.toastController.create({
            message: 'Albaran modificado',
            duration: 2000,
            color: 'success'
          });
          toast.present();
        }, async (error) => {
          this.loadingController.dismiss();
          const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'Parece que hay problemas ',
            message: 'Error al enviar el albaran ❌',
            buttons: ['OK']
          });
          await alert.present();
        })
    }else{
      const alert = await this.alertController.create({
        header: 'Rellene los campos',
        message: 'Por favor rellene los campos CIF y Nombre',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  change() {
    if (this.ifIncidencia == "F") {
      this.ifIncidencia = "T"
    } else {
      this.ifIncidencia = "F"
    }
  }

  clear() {
    this.signaturePad.clear();
  }

  openPdf() {
    var iframe = "<iframe height='100%' width='100%' frameborder='0' allowfullscreen webkitallowfullscreen mozallowfullscreen src='" + this.pdfFile + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
    this.checked = "T"
  }
}

