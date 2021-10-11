import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { PdfViewer } from 'capacitor-pdf-viewer-plugin';
import { registerWebPlugin } from '@capacitor/core';
import { ApiService } from '../../../app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';

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
  textemail;
  email;
  nif;
  name;
  signature;
  albId;
  pdfFile;
  checked = "F";
  open;
  data;
  contacts;
  incidencia = false
  constructor(public navCtrl: NavController, private authService: AuthenticationService, private _apiService: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      translucent: true,
    });
    await loading.present();
    this.albId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.albId);
    (await this._apiService.getPdf(this.albId)).subscribe(
      async (response) => {
        this.open = response.url 
        this.activatedRoute.queryParamMap.subscribe(params => this.data = params.getAll('foo')[0])
        this.pdfFile = this.sanitizer.bypassSecurityTrustResourceUrl(response.url);
          (await this._apiService.getContactos()).subscribe(
            (response) => {
              this.contacts = response
              this.loadingController.dismiss();
            }, async (error) => {
              this.loadingController.dismiss();
            })
      }, async (error) => {
        this.loadingController.dismiss();
        if (error.status === 401) {
          this.logout();
        } else {
          this.navCtrl.navigateForward('/home');
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
  drawStart() {
    console.log('drawStart');
  }

  drawComplete() {
    this.signature = this.signaturePad.toDataURL("image/jpeg", 0.5)
  }

  async send() {
    if (this.checked = "T" && this.signature && this.name && this.nif) {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        translucent: true,
      });
      await loading.present();
      let body = [{
        "sendEmail": true,
        "email": this.email,
        "textEmail": this.textemail,
        "FAL_FIRMA": this.signature,
        "FAL_INCCHECK": this.ifIncidencia,
        "FAL_INCIDENCIA": this.textIncidencia,
        "FAL_NIF": this.nif,
        "FAL_NOMBRE": this.name,
        "FAL_VISTO": this.checked
      }]
      this.albId = this.albId;
      (await this._apiService.putAlbaran(body, this.albId)).subscribe(
        async (response) => {
          this.loadingController.dismiss();
          this.navCtrl.navigateForward('/home');
          (await this._apiService.serve(this.albId)).subscribe(
            async (res) => {
              const toast = await this.toastController.create({
                message: 'Albaran modificado',
                duration: 3000,
                color: 'success'
              });
              toast.present();
            }
          )
          //toast

        }, async (error) => {
          this.loadingController.dismiss();
          if (error.status === 401) {
            this.logout();
          } else {
            this.navCtrl.navigateForward('/home');
            const alert = await this.alertController.create({
              header: 'Error',
              subHeader: 'Parece que hay problemas ',
              message: 'Error al cargar los albaranes por favor llame a servicio técnico 🤓',
              buttons: ['OK']
            });
            await alert.present();
          }
        })
    } else {
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
    var iframe = "<iframe height='100%' width='100%' frameborder='0' allowfullscreen webkitallowfullscreen mozallowfullscreen src='" + this.open + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
    this.checked = "T"
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  selectContact(contactvalue: any): void{
    this.email = contactvalue.detail.value.eMAIL;
    this.name = contactvalue.detail.value.nOMBRE;
    this.nif = contactvalue.detail.value.nIF;
  }
}

