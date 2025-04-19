import axios from "axios";

const getCryptoData = async (req, res) => {
  try {
    console.log("Fetching crypto data...");
    const max = 5;

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
};

export { getCryptoData };
