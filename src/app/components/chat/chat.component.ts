import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje: string;
  elemento: any;
  constructor(public _cs: ChatService) {
    /*this._cs.cargarMensajes().subscribe((mensajes:any[]) => {
      console.log(mensajes);
    });*/ // forma a

    this._cs.cargarMensajes().subscribe(() => {
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
    }); // forma mas eficiente
   }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }
  enviarMensaje() {
    console.log(this.mensaje);
    if(this.mensaje.length === 0) {
      return;
    }
    this._cs.enviarMensaje(this.mensaje)
      .then(() => {this.mensaje = '';
                    console.log('mensaje enviado')})
      .catch((err) => console.error('error al enviar', err));
  }

}
