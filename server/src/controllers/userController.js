const Joi = require("joi");
const bcrypt = require("bcryptjs");
const db = require("../databases/sequelize/models");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { send } = require("process");

const schemaRegister = Joi.object({
  firstName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Le nom est requis.",
    "string.min": "Le nom doit comporter au moins {#limit} caractères.",
    "string.max": "Le nom ne peut pas dépasser {#limit} caractères.",
  }),
  lastName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Le prénom est requis.",
    "string.min": "Le prénom doit comporter au moins {#limit} caractères.",
    "string.max": "Le prénom ne peut pas dépasser {#limit} caractères.",
  }),
  address: Joi.string()
    //.pattern(new RegExp("^[0-9]+\\s+[a-zA-Z]+\\s+[a-zA-Z\\s]+\\s+[0-9]{5}$"))
    .required()
    .messages({
      //"string.empty": "L'adresse est requis.",
      "string.pattern.base":
        "Le format de l'adresse est incorrect. Veuillez saisir un numéro de rue, le nom de la rue, la ville et le code postal.",
    }),
  email: Joi.string().email().required().messages({
    "string.empty": "L'e-mail est requis.",
    "string.email": "L'e-mail doit être une adresse e-mail valide.",
  }),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})")
    )
    .required()
    .messages({
      "string.empty": "Le mot de passe est requis.",
      "string.pattern.base":
        "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre, un symbole et être d'au moins 12 caractères.",
    }),
  phone: Joi.string()
    .required()
    .pattern(new RegExp("^(?:\\+33|0|0033)[1-9][0-9]{8}$"))
    .messages({
      "string.empty": "Le numéro de téléphone est requis.",
      "string.pattern.base":
        "Le numéro de téléphone doit être un numéro valide.",
    }),
  role: Joi.string().required().messages({
    "string.empty": "Le role est requis.",
  }),
  emailToken: Joi.string().allow(null, ""),
  rgpdChecked: Joi.boolean().required().valid(true).messages({
    "boolean.base":
      "Vous devez accepter la politique de gestion des données personnelles.",
    "any.only":
      "Vous devez accepter la politique de gestion des données personnelles.",
    "any.required":
      "Vous devez accepter la politique de gestion des données personnelles.",
  }),
});

const schemaUpdateUser = Joi.object({
  firstName: Joi.string().min(3).max(50).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères.",
    "string.empty": "Le nom est requis.",
    "string.min": "Le nom doit comporter au moins {#limit} caractères.",
    "string.max": "Le nom ne peut pas dépasser {#limit} caractères.",
    "any.required": "Le nom est requis.",
  }),
  lastName: Joi.string().min(3).max(50).required().messages({
    "string.base": "Le prénom doit être une chaîne de caractères.",
    "string.empty": "Le prénom est requis.",
    "string.min": "Le prénom doit comporter au moins {#limit} caractères.",
    "string.max": "Le prénom ne peut pas dépasser {#limit} caractères.",
    "any.required": "Le prénom est requis.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "L'email doit être valide.",
    "any.required": "L'email est requis.",
    "string.empty": "L'email est requis.",
  }),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})")
    )
    .required()
    .messages({
      "any.required": "Le mot de passe est requis.",
      "string.pattern.base":
        "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre, un symbole et être d'au moins 12 caractères.",
    }),
  phone: Joi.string()
    .required()
    .pattern(new RegExp("^(?:\\+33|0|0033)[1-9][0-9]{8}$"))
    .messages({
      "string.empty": "Le numéro de téléphone est requis",
      "any.required": "Le numéro de téléphone est requis.",
      "string.pattern.base":
        "Le numéro de téléphone doit être un numéro valide.",
    }),
  address: Joi.string()
    .pattern(new RegExp("^[0-9]+\\s+[a-zA-Z]+\\s+[a-zA-Z\\s]+\\s+[0-9]{5}$"))
    .required()
    .messages({
      "any.required": "L'adresse est requis.",
      "string.pattern.base":
        "Le format de l'adresse est incorrect. Veuillez saisir un numéro de rue, le nom de la rue, la ville et le code postal.",
    }),
  role: Joi.string().valid("ROLE_STORE_KEEPER", "USER").required().messages({
    "any.only": "Le rôle doit être soit 'Magasinier', soit 'USER'.",
    "string.empty": "Le rôle est requis.",
    "any.required": "Le rôle est requis.",
  }),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})")
    )
    .required()
    .messages({
      "string.empty": "Le mot de passe est requis.",
      "string.pattern.base":
        "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre, un symbole et être d'au moins 12 caractères.",
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.required": "La confirmation du mot de passe est requise.",
      "any.only":
        "La confirmation du mot de passe doit correspondre au nouveau mot de passe.",
      "string.empty": "La confirmation du mot de passe ne peut pas être vide.",
    }),
});

function generateConfirmationToken() {
  return crypto.randomBytes(20).toString("hex");
}

function sendConfirmationEmail(email, emailToken, lastName, firstName) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ali.khelifa@se.univ-bejaia.dz",
      pass: "nysn mjoy aotv bztg",
    },
    tls: { rejectUnauthorized: false },
  });
  const htmlContent = `
    <style type="text/css">
    #outlook a {
        padding: 0;
    }

    body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }
    strong a {
        text-decoration: none;
        color: #C58940 !important;
    }

    table,
    td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }

    img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
    }

    p {
        display: block;
        margin: 13px 0;
    }
</style>
<!--[if mso]>
<noscript>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
</noscript>
<![endif]-->
<!--[if lte mso 11]>
<style type="text/css">
    .mj-outlook-group-fix {
        width: 100% !important;
    }
</style>
<![endif]-->
<style type="text/css">
    @media only screen and (min-width: 480px) {
        .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
        }

        .mj-column-per-50 {
            width: 50% !important;
            max-width: 50%;
        }
    }
</style>
<style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
    }

    .moz-text-html .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
    }
</style>
<style type="text/css">
    @media only screen and (max-width: 480px) {
        table.mj-full-width-mobile {
            width: 100% !important;
        }

        td.mj-full-width-mobile {
            width: auto !important;
        }
    }
</style>

<body style="word-spacing:normal;background-color:#E7E7E7;">
<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Pre-header Text
</div>
<div style="background-color:#E7E7E7;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
           style="background-image:url("https://i.goopics.net/ihzg0n.png");background-repeat:no-repeat;background-size:100% 100%;width:100%;">
    <tbody>
    <tr>
        <td>
            <!--[if mso | IE]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;"
                   width="600" bgcolor="#040B4F">
                <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div style="margin:0px auto;max-width:600px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                       style="width:100%;">
                    <tbody>
                    <tr>
                        <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;text-align:center;">
                            <!--[if mso | IE]>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="" style="vertical-align:top;width:600px;"><![endif]-->
                            <div class="mj-column-per-100 mj-outlook-group-fix"
                                 style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                       style="vertical-align:top;" width="100%">
                                    <tbody>
                                    <tr>
                                        <td align="center"
                                            style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                            <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;letter-spacing:1px;line-height:24px;text-align:center;text-transform:uppercase;color:#ffffff;">
                                                <img src="https://i.goopics.net/pv3dn1.png" alt="Logo e-parfums"> <br>
                                                <span style="color: #979797; font-weight: normal">-</span>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--[if mso | IE]></td></tr></table><![endif]-->
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--[if mso | IE]></td></tr></table><![endif]-->
        </td>
    </tr>
    </tbody>
    </table>
    <!--[if mso | IE]>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
           bgcolor="#C58940">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="background:#C58940;background-color:#C58940;margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
               style="background:#C58940;background-color:#C58940;width:100%;">
            <tbody>
            <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="" style="vertical-align:top;width:600px;"><![endif]-->
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]></td></tr></table>
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook"
           style="width:600px;" width="600">
        <tr>
            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div class="body-section"
         style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); margin: 0px auto; max-width: 600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
               style="width:100%;">
            <tbody>
            <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;">
                    <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="background:#ffffff;background-color:#ffffff;width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                               style="vertical-align:top;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                    Confirmation d'inscription
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Bonjour ${lastName} ${firstName},
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                    Nous vous remercions de votre intérêt pour notre boutique en ligne de parfums.

                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                    Votre compte sur notre site a été créé avec succès. Pour activer votre compte et commencer à profiter de tous ses avantages, veuillez cliquer sur le lien ci-dessous :                                            </tr>
                                            <tr>
                                                <td align="center" vertical-align="middle"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           role="presentation"
                                                           style="border-collapse:separate;width:300px;line-height:100%;">
                                                        <tr>
                                                            <td align="center" bgcolor="#F41718"
                                                                role="presentation"
                                                                style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:transparent;"
                                                                valign="middle">
                                                                <a href="http://parfums-esgi.store/api/confirmEmail/${email}/${emailToken}" style="display:inline-block;width:250px;background:transparent;color:#C58940;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:17px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;border:1px solid #C58940;" target="_blank">Activer mon compte</a>.
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                    Après avoir activé votre compte, vous pourrez parcourir notre sélection de parfums de qualité et passer des commandes en toute simplicité.

                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table></td></tr>
                    <tr>
                        <td class="" width="600px">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                   style="width:600px;" width="600" bgcolor="#ffffff">
                                <tr>
                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="background:#ffffff;background-color:#ffffff;width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                               style="vertical-align:top;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="center"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <p style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:100%;">
                                                    </p>
                                                    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:520px;" role="presentation" width="520px" ><tr><td style="height:0;line-height:0;"> &nbsp;
                  </td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table></td></tr>
                    <tr>
                        <td class="" width="600px">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                   style="width:600px;" width="600" bgcolor="#ffffff">
                                <tr>
                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="background:#ffffff;background-color:#ffffff;width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:0 15px 0 15px;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                               style="vertical-align:top;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                        Si vous rencontrez des difficultés pour vous connecter à votre compte, contactez-nous à <strong>help@fastparfumes.com</strong>.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Bien cordialement.
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table></td></tr>
                    <tr>
                        <td class="" width="600px">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                   style="width:600px;" width="600" bgcolor="#ffffff">
                                <tr>
                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="background:#ffffff;background-color:#ffffff;width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" style="vertical-align:top;width:285px;"><![endif]-->
                                    <div class="mj-column-per-50 mj-outlook-group-fix"
                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                               style="vertical-align:top;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                        L'équipe Fast parfumes.
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td>
                                    <td class="" style="vertical-align:top;width:285px;"><![endif]-->
                                    <div class="mj-column-per-50 mj-outlook-group-fix"
                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                               style="vertical-align:top;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                        Horaires d'ouverture
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Lundi-Vendredi: 8:00 - 20:00 <br> Samedi-Dimanche: 9:00 - 18:00
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table></td></tr>
                    <tr>
                        <td class="" width="600px">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                   style="width:600px;" width="600" bgcolor="#ffffff">
                                <tr>
                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="background:#ffffff;background-color:#ffffff;width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                               style="vertical-align:top;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="center"
                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           role="presentation"
                                                           style="border-collapse:collapse;border-spacing:0px;">
                                                        <tbody>
                                                        <tr>
                                                            <td style="width:520px;">
                                                                <img alt height="auto"
                                                                     src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153579/Email/Images/AnnouncementOffset/map.jpg"
                                                                     style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                                                     width="520">
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
        <tr>
            <td>
                <!--[if mso | IE]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;"
                       width="600">
                    <tr>
                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                <div style="margin:0px auto;max-width:600px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                           style="width:100%;">
                        <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td class="" width="600px">
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                   class="" style="width:600px;" width="600">
                                                <tr>
                                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                <![endif]-->
                                <div style="margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                           role="presentation" style="width:100%;">
                                        <tbody>
                                        <tr>
                                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                                <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0"
                                                       cellspacing="0">
                                                    <tr>
                                                        <td class="" style="vertical-align:top;width:600px;">
                                                <![endif]-->
                                                <div class="mj-column-per-100 mj-outlook-group-fix"
                                                     style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           role="presentation" width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align:top;padding:0;">
                                                                <table border="0" cellpadding="0"
                                                                       cellspacing="0" role="presentation" style
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:24px;text-align:center;color:#445566;">
                                                                                <a href="#">www.fastparfumes.com</a>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:24px;text-align:center;color:#445566;">
                                                                                Afficher ce email dans votre navigateur
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                                Vous recevez cet e-mail publicitaire parce que vous vous êtes inscrit sur le site web de www.parfumes.com.. (242 Rue du Fauboursg-Saint-Antoine, Paris, 75012).
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                                &copy; parfumes.,
                                                                                Tous droits réservés.
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <!--[if mso | IE]></td></tr></table><![endif]-->
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table></td></tr>
                                <tr>
                                    <td class="" width="600px">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                               class="" style="width:600px;" width="600">
                                            <tr>
                                                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                <![endif]-->
                                <div style="margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0"
                                           role="presentation" style="width:100%;">
                                        <tbody>
                                        <tr>
                                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0;text-align:center;">
                                                <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0"
                                                       cellspacing="0">
                                                    <tr>
                                                        <td class="" style="width:600px;"><![endif]-->
                                                <div class="mj-column-per-100 mj-outlook-group-fix"
                                                     style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
                                                    <!--[if mso | IE]>
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           role="presentation">
                                                        <tr>
                                                            <td style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation" width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="vertical-align:top;padding-right:0;">
                                                                    <table border="0" cellpadding="0"
                                                                           cellspacing="0" role="presentation"
                                                                           style width="100%">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:16px;text-align:center;color:#445566;">
                                                                                    <a class="footer-link"
                                                                                       href="https://www.google.com"
                                                                                       style="color: #888888;">Confidentialité</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;<a
                                                                                            class="footer-link"
                                                                                            href="#"
                                                                                            style="color: #888888;">Se désabonner</a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso | IE]></td></tr></table><![endif]-->
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
        </tr>
        </tbody>
    </table>
</div>
</body>
  `;

  const mailOptions = {
    from: "votre_email@gmail.com",
    to: email,
    subject: "Confirmation d'inscription",
    html: htmlContent,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail de confirmation :",
        error
      );
    } else {
      console.log("E-mail de confirmation envoyé :", info.response);
    }
  });
}

exports.register = (
  firstName,
  lastName,
  password,
  address,
  email,
  phone,
  role = "USER",
  rgpdChecked
) => {
  return new Promise((resolve, reject) => {
    let validate = schemaRegister.validate({
      firstName,
      lastName,
      password,
      address,
      email,
      phone,
      role,
      rgpdChecked,
    });

    if (validate.error) {
      reject({ status: 400, message: validate.error.details[0].message });
    } else {
      db.User.count({ where: { email: email } })
        .then((userCount) => {
          if (userCount !== 0) {
            reject({ status: 409, message: "Cet email existe déjà" });
          } else {
            bcrypt.hash(password, 10).then((hashedPassword) => {
              const emailToken = generateConfirmationToken();
              const emailTokenExpiration = new Date();
              emailTokenExpiration.setDate(emailTokenExpiration.getDate() + 1);
              const allowedRoles = ["USER"];
              if (!allowedRoles.includes(role)) {
                reject({ status: 401, message: "Unauthorized role" });
                return;
              }
              db.User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                address: address,
                phone: phone,
                role: "USER",
                accountConfirmation: false,
                emailToken: emailToken,
                emailTokenExpiration: emailTokenExpiration,
                rgpdChecked: role === "ADMIN" ? null : rgpdChecked,
              })
                .then((response) => {
                  sendConfirmationEmail(email, emailToken, lastName, firstName);
                  resolve(response);
                })
                .catch((error) => {
                  reject({ status: 500, message: error.message });
                });
            });
          }
        })
        .catch((error) => {
          reject({
            status: 500,
            message: "Erreur lors de la vérification de l'existence de l'email",
          });
        });
    }
  });
};

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          reject("Adresse email invalide ou mot de passe incorrect");
        } else if (!user.accountConfirmation) {
          reject(
            "L'email n'a pas été confirmé. Veuillez vérifier votre boîte de réception pour le lien de confirmation."
          );
        } else if (user.lockedUntil && user.lockedUntil > new Date()) {
          reject(
            `Votre compte est temporairement verrouillé. Réessayez après 2 min.`
          );
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (same) {
              if (isPasswordExpired(user)) {
                const resetToken = generateConfirmationToken();
                const resetTokenExpiration = new Date();
                resetTokenExpiration.setDate(
                  resetTokenExpiration.getDate() + 1
                );
                user.resetToken = resetToken;
                user.resetTokenExpiration = resetTokenExpiration;
                user.save();
                sendEmailforgotPassword(user.email, resetToken);
                reject(
                  "Votre mot de passe a expiré. Un e-mail de renouvellement du mot de passe a été envoyé."
                );
              } else {
                let token = jwt.sign(
                  {
                    id: user.id,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    email: user.email,
                    address: user.address,
                    phone: user.phone,
                    role: user.role,
                  },
                  config.development.privateKey,
                  { expiresIn: "1h" }
                );

                user.update({ failedLoginAttempts: 0 });
                resolve({
                  token: token,
                });
              }
            } else {
              // Incrémenter le nombre de tentatives infructueuses
              user.update({
                failedLoginAttempts: user.failedLoginAttempts + 1,
              });
              if (user.failedLoginAttempts >= 3) {
                // Verrouiller le compte pour 30 minutes après 3 tentatives infructueuses
                const lockTime = new Date(Date.now() + 2 * 60000);
                user.update({ lockedUntil: lockTime });
                sendLockoutNotification(user.email, lockTime);
                reject(
                  `Vous avez dépassé le nombre maximal de tentatives de connexion. Veuillez réessayer après 2 min.`
                );
              } else {
                reject("Adresse email invalide ou mot de passe incorrect");
              }
            }
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.confirmEmail = (email, emailToken) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email: email, emailToken: emailToken } })
      .then((user) => {
        if (!user) {
          reject("Lien de confirmation invalide");
        } else {
          // Vérifier si le lien de confirmation a expiré
          if (user.emailTokenExpiration < new Date()) {
            reject("Le lien de confirmation a expiré");
          } else {
            // Marquer l'utilisateur comme confirmé dans la base de données
            user
              .update({ accountConfirmation: true })
              .then(() => {
                resolve("Email confirmé avec succès");
              })
              .catch((error) => {
                reject(error);
              });
          }
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

function sendEmailforgotPassword(email, resetToken) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ali.khelifa@se.univ-bejaia.dz",
        pass: "nysn mjoy aotv bztg",
      },
      tls: { rejectUnauthorized: false },
    });

    const resetLink = `http://parfums-esgi.store/renitialisation-mot-de-passe?token=${resetToken}`;
    const htmlContent = `
        <style type="text/css">
        #outlook a {
            padding: 0;
        }
    
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        strong a {
            text-decoration: none;
            color: #C58940 !important;
        }
    
        table,
        td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
    
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
    
        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
        .mj-outlook-group-fix {
            width: 100% !important;
        }
    </style>
    <![endif]-->
    <style type="text/css">
        @media only screen and (min-width: 480px) {
            .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
            }
    
            .mj-column-per-50 {
                width: 50% !important;
                max-width: 50%;
            }
        }
    </style>
    <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
        }
    
        .moz-text-html .mj-column-per-50 {
            width: 50% !important;
            max-width: 50%;
        }
    </style>
    <style type="text/css">
        @media only screen and (max-width: 480px) {
            table.mj-full-width-mobile {
                width: 100% !important;
            }
    
            td.mj-full-width-mobile {
                width: auto !important;
            }
        }
    </style>
    
    <body style="word-spacing:normal;background-color:#E7E7E7;">
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        Pre-header Text
    </div>
    <div style="background-color:#E7E7E7;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
               style="background-image:url("https://i.goopics.net/ihzg0n.png");background-repeat:no-repeat;background-size:100% 100%;width:100%;">
        <tbody>
        <tr>
            <td>
                <!--[if mso | IE]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;"
                       width="600" bgcolor="#040B4F">
                    <tr>
                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                <div style="margin:0px auto;max-width:600px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                           style="width:100%;">
                        <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;text-align:center;">
                                <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td class="" style="vertical-align:top;width:600px;"><![endif]-->
                                <div class="mj-column-per-100 mj-outlook-group-fix"
                                     style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                           style="vertical-align:top;" width="100%">
                                        <tbody>
                                        <tr>
                                            <td align="center"
                                                style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;letter-spacing:1px;line-height:24px;text-align:center;text-transform:uppercase;color:#ffffff;">
                                                    <img src="https://i.goopics.net/pv3dn1.png" alt="Logo e-parfums"> <br>
                                                    <span style="color: #979797; font-weight: normal">-</span>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table><![endif]-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
        </tr>
        </tbody>
        </table>
        <!--[if mso | IE]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
               bgcolor="#C58940">
            <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#C58940;background-color:#C58940;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                   style="background:#C58940;background-color:#C58940;width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                        <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td class="" style="vertical-align:top;width:600px;"><![endif]-->
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]></td></tr></table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook"
               style="width:600px;" width="600">
            <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div class="body-section"
             style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); margin: 0px auto; max-width: 600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                   style="width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;">
                        <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td class="" width="600px">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                           style="width:600px;" width="600" bgcolor="#ffffff">
                                        <tr>
                                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                        Réinitialisation de mot de passe
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                            Bonjour ,
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte sur notre boutique en ligne de parfums.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                        Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :
                                                    </div>
                                                </td>
                                            </tr>
                                                    <td align="center" vertical-align="middle"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation"
                                                               style="border-collapse:separate;width:300px;line-height:100%;">
                                                            <tr>
                                                                <td align="center" bgcolor="#F41718"
                                                                    role="presentation"
                                                                    style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:transparent;"
                                                                    valign="middle">
                                                                    <a href="${resetLink}" style="display:inline-block;width:250px;background:transparent;color:#C58940;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:17px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;border:1px solid #C58940;" target="_blank">Réinitialiser votre mot de passe</a>.
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                    
                            
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="center"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <p style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:100%;">
                                                        </p>
                                                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:520px;" role="presentation" width="520px" ><tr><td style="height:0;line-height:0;"> &nbsp;
                      </td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:0 15px 0 15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                            Si vous rencontrez des difficultés pour vous connecter à votre compte, contactez-nous à <strong>help@fastparfumes.com</strong>.
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                            Bien cordialement.
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:285px;"><![endif]-->
                                        <div class="mj-column-per-50 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                            L'équipe Fast parfumes.
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td>
                                        <td class="" style="vertical-align:top;width:285px;"><![endif]-->
                                        <div class="mj-column-per-50 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                            Horaires d'ouverture
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                            Lundi-Vendredi: 8:00 - 20:00 <br> Samedi-Dimanche: 9:00 - 18:00
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="center"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation"
                                                               style="border-collapse:collapse;border-spacing:0px;">
                                                            <tbody>
                                                            <tr>
                                                                <td style="width:520px;">
                                                                    <img alt height="auto"
                                                                         src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153579/Email/Images/AnnouncementOffset/map.jpg"
                                                                         style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                                                         width="520">
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
            <tr>
                <td>
                    <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;"
                           width="600">
                        <tr>
                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                    <div style="margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" width="600px">
                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                       class="" style="width:600px;" width="600">
                                                    <tr>
                                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                               role="presentation" style="width:100%;">
                                            <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                                    <!--[if mso | IE]>
                                                    <table role="presentation" border="0" cellpadding="0"
                                                           cellspacing="0">
                                                        <tr>
                                                            <td class="" style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation" width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="vertical-align:top;padding:0;">
                                                                    <table border="0" cellpadding="0"
                                                                           cellspacing="0" role="presentation" style
                                                                           width="100%">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:24px;text-align:center;color:#445566;">
                                                                                    <a href="#">www.fastparfumes.com</a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:24px;text-align:center;color:#445566;">
                                                                                    Afficher ce email dans votre navigateur
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                                    Vous recevez cet e-mail publicitaire parce que vous vous êtes inscrit sur le site web de www.parfumes.com.. (242 Rue du Fauboursg-Saint-Antoine, Paris, 75012).
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                                    &copy; parfumes.,
                                                                                    Tous droits réservés.
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table></td></tr>
                                    <tr>
                                        <td class="" width="600px">
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                   class="" style="width:600px;" width="600">
                                                <tr>
                                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                               role="presentation" style="width:100%;">
                                            <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0;text-align:center;">
                                                    <!--[if mso | IE]>
                                                    <table role="presentation" border="0" cellpadding="0"
                                                           cellspacing="0">
                                                        <tr>
                                                            <td class="" style="width:600px;"><![endif]-->
                                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                                         style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
                                                        <!--[if mso | IE]>
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation">
                                                            <tr>
                                                                <td style="vertical-align:top;width:600px;">
                                                        <![endif]-->
                                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                   role="presentation" width="100%">
                                                                <tbody>
                                                                <tr>
                                                                    <td style="vertical-align:top;padding-right:0;">
                                                                        <table border="0" cellpadding="0"
                                                                               cellspacing="0" role="presentation"
                                                                               style width="100%">
                                                                            <tbody>
                                                                            <tr>
                                                                                <td align="center"
                                                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:16px;text-align:center;color:#445566;">
                                                                                        <a class="footer-link"
                                                                                           href="https://www.google.com"
                                                                                           style="color: #888888;">Confidentialité</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;<a
                                                                                                class="footer-link"
                                                                                                href="#"
                                                                                                style="color: #888888;">Se désabonner</a>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                                    </div>
                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    </body>
      `;

    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(
          "Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe :",
          error
        );
        reject(
          "Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe"
        );
      } else {
        resolve(
          "Un e-mail de réinitialisation du mot de passe a été envoyé avec succès"
        );
      }
    });
  });
}
function sendLockoutNotification(email, lockUntil) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ali.khelifa@se.univ-bejaia.dz",
        pass: "nysn mjoy aotv bztg",
      },
      tls: { rejectUnauthorized: false },
    });

    const htmlContent = `
        <style type="text/css">
        #outlook a {
            padding: 0;
        }
    
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        strong a {
            text-decoration: none;
            color: #C58940 !important;
        }
    
        table,
        td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
    
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
    
        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
        .mj-outlook-group-fix {
            width: 100% !important;
        }
    </style>
    <![endif]-->
    <style type="text/css">
        @media only screen and (min-width: 480px) {
            .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
            }
    
            .mj-column-per-50 {
                width: 50% !important;
                max-width: 50%;
            }
        }
    </style>
    <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
        }
    
        .moz-text-html .mj-column-per-50 {
            width: 50% !important;
            max-width: 50%;
        }
    </style>
    <style type="text/css">
        @media only screen and (max-width: 480px) {
            table.mj-full-width-mobile {
                width: 100% !important;
            }
    
            td.mj-full-width-mobile {
                width: auto !important;
            }
        }
    </style>
    
    <body style="word-spacing:normal;background-color:#E7E7E7;">
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        Pre-header Text
    </div>
    <div style="background-color:#E7E7E7;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
               style="background-image:url("https://i.goopics.net/ihzg0n.png");background-repeat:no-repeat;background-size:100% 100%;width:100%;">
        <tbody>
        <tr>
            <td>
                <!--[if mso | IE]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;"
                       width="600" bgcolor="#040B4F">
                    <tr>
                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                <div style="margin:0px auto;max-width:600px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                           style="width:100%;">
                        <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;text-align:center;">
                                <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td class="" style="vertical-align:top;width:600px;"><![endif]-->
                                <div class="mj-column-per-100 mj-outlook-group-fix"
                                     style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                           style="vertical-align:top;" width="100%">
                                        <tbody>
                                        <tr>
                                            <td align="center"
                                                style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;letter-spacing:1px;line-height:24px;text-align:center;text-transform:uppercase;color:#ffffff;">
                                                    <img src="https://i.goopics.net/pv3dn1.png" alt="Logo e-parfums"> <br>
                                                    <span style="color: #979797; font-weight: normal">-</span>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!--[if mso | IE]></td></tr></table><![endif]-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
        </tr>
        </tbody>
        </table>
        <!--[if mso | IE]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
               bgcolor="#C58940">
            <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background:#C58940;background-color:#C58940;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                   style="background:#C58940;background-color:#C58940;width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                        <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td class="" style="vertical-align:top;width:600px;"><![endif]-->
                        <!--[if mso | IE]></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]></td></tr></table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook"
               style="width:600px;" width="600">
            <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div class="body-section"
             style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); margin: 0px auto; max-width: 600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                   style="width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0;padding-top:0;text-align:center;">
                        <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td class="" width="600px">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                           style="width:600px;" width="600" bgcolor="#ffffff">
                                        <tr>
                                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                        verrouillage de votre compte
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                            Bonjour ,
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                            
                                            </tr>
                                            <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                    Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion infructueuses. Veuillez réessayer après 2min.                                                    </div>
                                                </td>
                                            </tr>
                                                    <td align="center" vertical-align="middle"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation"
                                                               style="border-collapse:separate;width:300px;line-height:100%;">
                                                           
                                                        </table>
                                                    </td>
                                                </tr>
                                    
                            
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;padding-top:0;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="center"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <p style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:100%;">
                                                        </p>
                                                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #DFE3E8;font-size:1px;margin:0px auto;width:520px;" role="presentation" width="520px" ><tr><td style="height:0;line-height:0;"> &nbsp;
                      </td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:0 15px 0 15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:24px;text-align:left;color:#212b35;">
                                                            Si vous rencontrez des difficultés pour vous connecter à votre compte, contactez-nous à <strong>help@fastparfumes.com</strong>.
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                            Bien cordialement.
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:285px;"><![endif]-->
                                        <div class="mj-column-per-50 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                            L'équipe Fast parfumes.
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td>
                                        <td class="" style="vertical-align:top;width:285px;"><![endif]-->
                                        <div class="mj-column-per-50 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:24px;text-align:left;text-transform:uppercase;color:#212b35;">
                                                            Horaires d'ouverture
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left"
                                                        style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:24px;text-align:left;color:#637381;">
                                                            Lundi-Vendredi: 8:00 - 20:00 <br> Samedi-Dimanche: 9:00 - 18:00
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr>
                        <tr>
                            <td class="" width="600px">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class=""
                                       style="width:600px;" width="600" bgcolor="#ffffff">
                                    <tr>
                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                        <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                   style="background:#ffffff;background-color:#ffffff;width:100%;">
                                <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;">
                                        <!--[if mso | IE]>
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="" style="vertical-align:top;width:570px;"><![endif]-->
                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                   style="vertical-align:top;" width="100%">
                                                <tbody>
                                                <tr>
                                                    <td align="center"
                                                        style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation"
                                                               style="border-collapse:collapse;border-spacing:0px;">
                                                            <tbody>
                                                            <tr>
                                                                <td style="width:520px;">
                                                                    <img alt height="auto"
                                                                         src="https://res.cloudinary.com/dheck1ubc/image/upload/v1544153579/Email/Images/AnnouncementOffset/map.jpg"
                                                                         style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                                                         width="520">
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
            <tr>
                <td>
                    <!--[if mso | IE]>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;"
                           width="600">
                        <tr>
                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
                    <div style="margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                               style="width:100%;">
                            <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                    <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td class="" width="600px">
                                                <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                       class="" style="width:600px;" width="600">
                                                    <tr>
                                                        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                               role="presentation" style="width:100%;">
                                            <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                                    <!--[if mso | IE]>
                                                    <table role="presentation" border="0" cellpadding="0"
                                                           cellspacing="0">
                                                        <tr>
                                                            <td class="" style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                                         style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation" width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td style="vertical-align:top;padding:0;">
                                                                    <table border="0" cellpadding="0"
                                                                           cellspacing="0" role="presentation" style
                                                                           width="100%">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:24px;text-align:center;color:#445566;">
                                                                                    <a href="#">www.fastparfumes.com</a>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:24px;text-align:center;color:#445566;">
                                                                                    Afficher ce email dans votre navigateur
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                                    Vous recevez cet e-mail publicitaire parce que vous vous êtes inscrit sur le site web de www.parfumes.com.. (242 Rue du Fauboursg-Saint-Antoine, Paris, 75012).
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center"
                                                                                style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;">
                                                                                    &copy; parfumes.,
                                                                                    Tous droits réservés.
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table></td></tr>
                                    <tr>
                                        <td class="" width="600px">
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                   class="" style="width:600px;" width="600">
                                                <tr>
                                                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                               role="presentation" style="width:100%;">
                                            <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0;text-align:center;">
                                                    <!--[if mso | IE]>
                                                    <table role="presentation" border="0" cellpadding="0"
                                                           cellspacing="0">
                                                        <tr>
                                                            <td class="" style="width:600px;"><![endif]-->
                                                    <div class="mj-column-per-100 mj-outlook-group-fix"
                                                         style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
                                                        <!--[if mso | IE]>
                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                               role="presentation">
                                                            <tr>
                                                                <td style="vertical-align:top;width:600px;">
                                                        <![endif]-->
                                                        <div class="mj-column-per-100 mj-outlook-group-fix"
                                                             style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                   role="presentation" width="100%">
                                                                <tbody>
                                                                <tr>
                                                                    <td style="vertical-align:top;padding-right:0;">
                                                                        <table border="0" cellpadding="0"
                                                                               cellspacing="0" role="presentation"
                                                                               style width="100%">
                                                                            <tbody>
                                                                            <tr>
                                                                                <td align="center"
                                                                                    style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                                    <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:16px;text-align:center;color:#445566;">
                                                                                        <a class="footer-link"
                                                                                           href="https://www.google.com"
                                                                                           style="color: #888888;">Confidentialité</a>&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;<a
                                                                                                class="footer-link"
                                                                                                href="#"
                                                                                                style="color: #888888;">Se désabonner</a>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <!--[if mso | IE]></td></tr></table><![endif]-->
                                                    </div>
                                                    <!--[if mso | IE]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso | IE]></td></tr></table></td></tr></table><![endif]-->
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    </body>
      `;

    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Notification de verrouillage de compte",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail  :", error);
        reject("Erreur lors de l'envoi de l'e-mail ");
      } else {
        resolve("Un e-mail a été envoyé avec succès");
      }
    });
  });
}
function isPasswordExpired(user) {
  const passwordExpirationDate = user.lastPasswordChange
    ? new Date(user.lastPasswordChange.getTime() + 60 * 24 * 60 * 60 * 1000)
    : new Date(user.createdAt.getTime() + 60 * 24 * 60 * 60 * 1000);
  return passwordExpirationDate <= new Date();
}
exports.forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    db.User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          reject("Aucun utilisateur trouvé avec cet e-mail");
        } else {
          const resetToken = crypto.randomBytes(20).toString("hex");
          const resetTokenExpiration = new Date();
          resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1);

          if (resetTokenExpiration < new Date()) {
            reject("Le token de réinitialisation a expiré");
            return;
          }

          user
            .update({
              resetToken: resetToken,
              resetTokenExpiration: resetTokenExpiration,
            })
            .then((response) => {
              sendEmailforgotPassword(email, resetToken)
                .then(() => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.resetPassword = (newPassword, confirmPassword, resetToken) => {
  return new Promise((resolve, reject) => {
    // Validation des données
    const { error } = resetPasswordSchema.validate({
      newPassword,
      confirmPassword,
    });
    if (error) {
      reject("Validation des données échouée");
      return;
    }

    db.User.findOne({ where: { resetToken: resetToken } })
      .then((user) => {
        if (!user) {
          reject("Opération de réinitialisation invalide");
        } else if (user.resetTokenExpiration < new Date()) {
          reject("Opération de réinitialisation expirée");
        } else {
          bcrypt
            .hash(newPassword, 10)
            .then((hashedPassword) => {
              user
                .update({
                  password: hashedPassword,
                  resetToken: null,
                  resetTokenExpiration: null,
                })
                .then(() => {
                  resolve("Mot de passe réinitialisé avec succès");
                })
                .catch((error) => {
                  reject("Échec de la mise à jour du mot de passe");
                });
            })
            .catch((error) => {
              reject("Erreur interne du serveur");
            });
        }
      })
      .catch((error) => {
        reject("Erreur interne du serveur");
      });
  });
};

exports.createUser = ({
  firstName,
  lastName,
  password,
  address,
  email,
  phone,
  role,
  rgpdChecked,
}) => {
  return new Promise((resolve, reject) => {
    let validate = schemaRegister.validate({
      firstName,
      lastName,
      password,
      address,
      email,
      phone,
      role,
      rgpdChecked,
    });
    if (validate.error) {
      reject(validate.error.details[0].message);
    } else {
      db.User.count({ where: { email: email } })
        .then((userCount) => {
          if (userCount !== 0) {
            reject("Cet email existe déjà");
          } else {
            bcrypt.hash(password, 10).then((hashedPassword) => {
              const emailToken = generateConfirmationToken();
              const emailTokenExpiration = new Date();
              emailTokenExpiration.setDate(emailTokenExpiration.getDate() + 1);
              db.User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                address: address,
                phone: phone,
                role: role,
                accountConfirmation: false,
                emailToken: emailToken,
                emailTokenExpiration: emailTokenExpiration,
              })
                .then((response) => {
                  sendConfirmationEmail(email, emailToken, lastName, firstName);
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            });
          }
        })
        .catch((error) => {
          reject("Erreur lors de la vérification de l'existence de l'email");
        });
    }
  });
};
exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.User.findAll({
      where: {
        deleted: false,
      },
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  });
};

exports.getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.User.findByPk(userId)
      .then((user) => {
        if (!user) {
          reject("User not found");
        } else {
          resolve(user);
        }
      })
      .catch((err) => reject(err));
  });
};

exports.updateUser = (
  userId,
  { firstName, lastName, email, password, address, phone, role, token }
) => {
  return new Promise((resolve, reject) => {
    const { error } = schemaUpdateUser.validate({
      firstName,
      lastName,
      email,
      password,
      address,
      phone,
      role,
    });
    if (error) {
      return reject(error.details[0].message);
    }
    if (role === "USER" || role === "ROLE_STORE_KEEPER") {
      if (token) {
        const decoded = jwt.verify(token, config.development.privateKey);
        if (parseInt(userId) !== parseInt(decoded.id)) {
          return reject(new Error("Access denied: Forbidden"));
        }
      }
    }

    db.User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return reject("User not found");
        }

        if (password) {
          return bcrypt.hash(password, 10).then((hashedPassword) => {
            return user.update({
              firstName,
              lastName,
              email,
              password: hashedPassword,
              address,
              phone,
              role: role==="ADMIN"? role :user.role,
            });
          });
        } else {
          return user.update({
            firstName,
            lastName,
            email,
            address,
            phone,
            role: role==="ADMIN"? role :user.role,
          });
        }
      })
      .then((updatedUser) => resolve(updatedUser))
      .catch((err) => reject(err));
  });
};

exports.deleteUser = (userId, role, token) => {
    return new Promise((resolve, reject) => {
      db.User.findByPk(userId)
        .then((user) => {
          if (!user) {
            reject("User not found");
          } else {
            if (role === "USER" || role === "ROLE_STORE_KEEPER") {
              if (token) {
                const decoded = jwt.verify(token, config.development.privateKey);
                if (parseInt(userId, 10) !== parseInt(decoded.id, 10)) {
                  return reject("Access denied: Forbidden");
                }
              }
            }
            
            const pseudonym = `utilisateur_supprime`;
  
            user.firstName = pseudonym;
            user.lastName = pseudonym;
            user.address = null;
            user.email = `${pseudonym}@example.com`;
            user.phone = null;
            user.password = "";
            user.role = null;
            user.accountConfirmation = false;
            user.emailToken = null;
            user.emailTokenExpiration = null;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            user.failedLoginAttempts = 0;
            user.lastPasswordChange = null;
            user.lockedUntil = null;
            user.deleted = true;
            return user.save();
          }
        })
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  };