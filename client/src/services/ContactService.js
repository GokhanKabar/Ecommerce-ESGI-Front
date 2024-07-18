import Api from './Api';

export default {
  sendContactForm(formData) {
    return Api().post('contact/send-contact', formData);
  }
};