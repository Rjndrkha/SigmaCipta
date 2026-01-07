function validateInput(input) {
  if (input === undefined || input === null || input === "") {
    return "Input harus diberikan";
  }
  return null;
}

function validateNumber(input) {
  if (isNaN(input)) {
    return "Input harus angka";
  }
  return null;
}

function validateAlphabet(input) {
  const regex = /^[A-Za-z]+$/;
  if (!regex.test(input)) {
    return "Input harus alfabet";
  }
  return null;
}

function validateName(input) {
  if (input.trim().split(" ").length <= 1) {
    return "Nama tidak boleh dari satu kata";
  }
  return null;
}

const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return res
        .status(400)
        .json({ success: false, message: `${key} is required.` });
    }
  }
  return null;
};

const isValidDate = (date) => {
  return (
    typeof date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !isNaN(new Date(date).getTime())
  );
};

module.exports = {
  validateInput,
  validateNumber,
  validateAlphabet,
  validateName,
  validateFields,
  isValidDate,
};
