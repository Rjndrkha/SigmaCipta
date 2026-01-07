import React from "react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const defaultDateFormat = "DD-MMM-YYYY";

interface DatePickerInputProps {
  type: "single" | "range";
  dateFormat?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  value?: any;
  onChange?: (value: any) => void;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  type,
  dateFormat,
  defaultStartDate = "2015/01/01",
  defaultEndDate = "2015/01/01",
  value,
  onChange,
}) => {
  const formattedDate = dateFormat ? dateFormat : defaultDateFormat;

  // Fungsi handler untuk format tanggal sebelum dikirim ke `onChange`
  const handleDateChange = (dates: any) => {
    if (type === "range") {
      const formattedDates = dates
        ? dates.map((date: any) => dayjs(date).format(formattedDate))
        : null;
      onChange?.(formattedDates);
    } else {
      const result = dates ? dayjs(dates).format(formattedDate) : null;
      onChange?.(result);
    }
  };

  if (type === "range") {
    return (
      <Space direction="vertical" size={12}>
        <RangePicker
          // defaultValue={[
          //   dayjs(defaultStartDaSte, formattedDate),
          //   dayjs(defaultEndDate, formattedDate),
          // ]}
          value={
            value ? value.map((date: any) => dayjs(date, formattedDate)) : null
          }
          onChange={handleDateChange}
          format={formattedDate}
        />
      </Space>
    );
  }
  return (
    <Space direction="vertical" size={12}>
      <DatePicker
        value={value ? dayjs(value, dateFormat) : null}
        onChange={handleDateChange}
        format={formattedDate}
      />
    </Space>
  );
};

export default DatePickerInput;
