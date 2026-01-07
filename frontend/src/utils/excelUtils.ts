import { DateFormatter } from "./dateConverter";
import { message } from "antd";

export const downloadExcelFile = (generalLedger: any, inputField: any) => {
  const formattedStartDateGB = DateFormatter(
    inputField.start_date
  ).toUpperCase();
  const formattedEndDateGB = DateFormatter(inputField.end_date).toUpperCase();

  let filename = `DATA GL GABUNGAN ALL CABANG PERIODE ${formattedStartDateGB} - ${formattedEndDateGB}.xlsx`;

  const { with_company, id_company, with_account, id_account } = inputField;

  let company1 = id_company.split("-")[0];
  let company2 = id_company.split("-")[1];

  if (with_company && company1 && company2) {
    filename =
      company1 === company2
        ? `DATA GL ${company1} PERIODE ${formattedStartDateGB} - ${formattedEndDateGB}.xlsx`
        : `DATA GL ${company1}-${company2} PERIODE ${formattedStartDateGB} - ${formattedEndDateGB}.xlsx`;
  }

  let coa1 = id_account.split("-")[0];
  let coa2 = id_account.split("-")[1];

  if (with_account && coa1 && coa2) {
    filename =
      coa1 === coa2
        ? `DATA GL ACCOUNT ${coa1} PERIODE ${formattedStartDateGB} - ${formattedEndDateGB}.xlsx`
        : `DATA GL ACCOUNT ${coa1}-${coa2} PERIODE ${formattedStartDateGB} - ${formattedEndDateGB}.xlsx`;
  }

  if (with_account && with_company) {
    filename = `DATA GL ${company1}-${company2} ACCOUNT ${coa1}-${coa2} PERIODE ${formattedStartDateGB} - ${formattedEndDateGB}.xlsx`;
  }

  const url = window.URL.createObjectURL(new Blob([generalLedger.data]));
  const link = document.createElement("a");
  link.href = url;

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  message.success("File berhasil diunduh!");
};
