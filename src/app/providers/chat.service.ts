import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[];
  public usuario: any = {
    nombre: '',
    uid: ''
  };

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      console.log('Estado del usuario: ', user);
      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    if (proveedor === 'google') {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      console.log('la auth de twitter no funciona porque no tengo cuenta twitter');
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      this.chats = [];
      for (let mensaje of mensajes) {
        this.chats.unshift(mensaje);
      }
      return this.chats;
    }));
  }

  enviarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }

    return this.itemsCollection.add(mensaje); // este add devuelve una promesa con then y catch por tanto podemos controlar que llega
  }
}
