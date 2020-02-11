import Files from '../models/Files';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await Files.create({ name, path });

    return res.json(file);
  }
}

export default new FileController();
