// src/app/login/login.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  async onLogin() {
    const { email, password } = this.loginData;

    // Aquí debes implementar la lógica de autenticación
    // Por ejemplo, llamar a un servicio de autenticación

    if (email === 'test@example.com' && password === '123456') {
      // Autenticación exitosa
      this.router.navigate(['/home']);
    } else {
      // Autenticación fallida
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo electrónico o contraseña incorrectos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
