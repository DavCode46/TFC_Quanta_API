import express from "express";
const router = express.Router();

const faqData = [
  {
    question: "Iniciar chat",
    answer: "Hola, ¿en qué te puedo ayudar?",
  },
  {
    question: "¿Cómo creo una cuenta?",
    answer:
      "Para crear una cuenta en Quanta, debes de seleccionar el botón Crear cuenta situado en la página principal, a continuación debes introducir tus datos personales y seleccionar Registrarse.",
  },
  {
    question: "¿Cómo inicio sesión?",
    answer:
      "Para iniciar sesión, debes de seleccionar el botón Iniciar sesión situado en la página principal, a continuación debes introducir tu correo electrónico y contraseña.",
  },
  {
    question: "¿Cómo recupero la contraseña?",
    answer:
      "Para restablecer tu contraseña, debes de seleccionar el enlace “¿Has olvidado tu contraseña? Restablecer” situado en la página de inicio de sesión, a continuación debes de introducir tu correo electrónico. Si este se encuentra en nuestros sistemas, recibirás un email con los pasos a seguir.",
  },
  {
    question: "¿Cómo modifico mi perfil?",
    answer:
      "Para modificar tu perfil (datos personales o imagen de perfil) debes ir a la sección Perfil, pulsar el botón con tus iniciales situado en la parte superior derecha de la página principal y, una vez en tu página de perfil, podrás modificar tu email, contraseña o imagen de perfil.",
  },
  {
    question: "¿Cómo ingreso dinero?",
    answer:
      "Para ingresar dinero, debes ir a la sección de Ingreso (icono +) situada en la página principal y seguir las instrucciones para realizar un depósito.",
  },
  {
    question: "¿Cómo retiro dinero?",
    answer:
      "Para retirar dinero, debes ir a la sección de Retiro (icono -) situada en la página principal y seguir las instrucciones para realizar un retiro.",
  },
  {
    question: "¿Cómo realizo una transferencia?",
    answer:
      "Para realizar una transferencia, selecciona la opción de Transferencia (icono ⮂) en el menú inferior, ingresa el número de cuenta y la cantidad a transferir.",
  },
  {
    question: "¿Cómo accedo a mis movimientos?",
    answer:
      "Para acceder a todos tus movimientos debes seleccionar el botón con símbolo en espiral situado en la página principal. Si solo deseas ver tus últimos movimientos, puedes hacerlo desde la página principal, en esta sección se mostrarán tus 8 movimientos más recientes.",
  },
  {
    question: "¿Cómo accedo a la sección de criptomonedas?",
    answer:
      "Para acceder a la sección de criptomonedas debes seleccionar el botón “Crypto” situado en el menú inferior.",
  },
];

router.get("/", (req, res) => {
  res.json(faqData);
});

export default router;
