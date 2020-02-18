import zipapi from '../services/zipapi';

class ZipCodeController {
  async show(req, res) {
    try {
      const { zipcode } = req.body;
      const normalizeZipcode = zipcode.replace('-', '');

      const response = await zipapi.get(`/${normalizeZipcode}/json`);

      const { logradouro, uf, localidade } = response.data;

      return res.json({
        street: logradouro,
        state: uf,
        city: localidade
      });
    } catch (error) {
      return res.status(401).json({ error: 'Zipcode invalid!' });
    }
  }
}

export default new ZipCodeController();
