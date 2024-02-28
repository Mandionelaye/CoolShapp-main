import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';
@Injectable({
  providedIn: 'root'
})
export class FirstServiceService {
  iduser:string; 
  idConv:string;
  numbreMssg:number;
  selectedImage: any;
  //fonction pour la compresion d'image qui vas etre soteck dans la base de donnee
  async compressImage(file: any): Promise<string> {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 200,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const compressedDataUrl = await this.convertFileToDataUrl(compressedFile);
      return compressedDataUrl;
    } catch (error) {
      throw error;
    }
  }

  // fonction pour convertir l'image en data url pour le stocke dans la base de donne
  convertFileToDataUrl(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader:any = new FileReader();

      reader.onload = () => {
      const dataURL = reader.result.length;
      const vall= dataURL / 1024;
      const imageSizeInKB = Math.round(vall * 100) / 100;
      console.log('Taille de l\'image :', imageSizeInKB, 'Ko');
      console.log(dataURL);
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
