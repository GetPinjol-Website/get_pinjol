export class AboutModel {
  constructor(data) {
    this.description = data.description || 'GetPinjol adalah platform untuk mendeteksi pinjol ilegal dan memberikan edukasi finansial.';
    this.contact = data.contact || 'support@getpinjol.com';
  }
}