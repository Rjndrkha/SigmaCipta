const jwt = require("jsonwebtoken");
const bypassUsername = "testing";
const bypassPassword = "testing";

const AuthLogin = async (username, password) => {
  try {
    if (username === bypassUsername && password === bypassPassword) {
      const responseBypass = {
        jab_ket: "testing",
        jab_kode: "testing",
        pslh_id: 21982,
        pslh_nama: "testing",
        pslh_nrp: "012345",
        utk_ket: "testing",
        utk_kode: "testing",
      };
      const token = jwt.sign(responseBypass, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return {
        success: true,
        token: token,
        nama: responseBypass.pslh_nama,
        nrp: responseBypass.pslh_nrp,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message ? error.message : "Login Failed!",
    };
  }
};

const authentificationController = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(500).json({ error: "username harus diberikan" });
  }

  if (!password) {
    return res.status(500).json({ error: "password harus diberikan" });
  }

  const json = await AuthLogin(username, password);
  res.json(json);
};

module.exports = { authentificationController };
