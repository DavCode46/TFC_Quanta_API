// import axios from "axios";
import { completeCryptoData, cryptoData } from "../data/crypto.js";

const getCryptoData = async (req, res) => {
  /*
  try {
    const max = 15;

    const cryptos = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=${max}&convert=EUR`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API_KEY,
        },
      }
    );

    console.log(cryptos.data);

    return res.json(cryptos.data.data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al obtener las criptomonedas" });
  }
*/

  return res.status(200).json(cryptoData);
};

const getCompleteCryptosData = async (req, res) => {
  /*
  try {
    const ids = req.query.ids || "1,1027,825,52";
    const cryptos = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ids}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API_KEY,
        },
      }
    );

    console.log(cryptos.data);

    return res.json(cryptos.data.data);
  } catch (error) {
    console.error(error.response.data);
    return res
      .status(500)
      .json({ error: "Error al obtener las criptomonedas" });
  }
*/

  return res.status(200).json(completeCryptoData);
};

const getCryptoDataById = async (req, res) => {
  const { id } = req.params;

  const crypto = cryptoData.find((crypto) => crypto.id === Number(id));

  if (!crypto) {
    return res.status(404).json({ error: "Crypto no encontrada" });
  }

  return res.status(200).json(crypto);
};

const getCompleteCryptoDataById = async (req, res) => {
  const { id } = req.params;

  const crypto = completeCryptoData.find((crypto) => crypto.id === Number(id));

  if (!crypto) {
    return res.status(404).json({ error: "Crypto no encontrada" });
  }

  return res.status(200).json(crypto);
};

export {
  getCompleteCryptoDataById,
  getCompleteCryptosData,
  getCryptoData,
  getCryptoDataById,
};
