// src/app/register/register.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup; // Asignación definida
  showDatepicker: boolean = false; // Variable para mostrar/ocultar el selector de fecha

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Inicialización del formulario reactivo
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validator: this.passwordMatchValidator });
  }

  // Método para alternar la visibilidad del selector de fecha
  toggleDatepicker() {
    this.showDatepicker = !this.showDatepicker; // Alterna la visibilidad
  }

  // Validador personalizado para comprobar si las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      // Mostrar errores si el formulario es inválido
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando...'
    });
    await loading.present();

    const { fullName, surname, birthday, gender, username, email, password } = this.registerForm.value;

    // Aquí debes implementar la lógica de registro, por ejemplo, llamar a un servicio de registro
    // Simulación de registro exitoso
    setTimeout(async () => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Te has registrado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/login']);
    }, 2000);
  }
}
