import React, { useState } from "react";
import ButtonDefault from "../../../component/button/button";
import MoviesClient from "../../../service/movies/MoviesClient";
import Cookies from "js-cookie";
import TableMovies from "./table";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";

function IndexCRUDMovies() {
  const [loading, setLoading] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [form] = Form.useForm();

  const token = Cookies.get("token") || "";
  const SyncData = async () => {
    setLoading(true);

    const { response } = await MoviesClient.SyncMoviesData({}, token);

    if (response) {
      message.info("Fetch Data Successfuly");
      window.location.reload();
    }
    setLoading(false);
  };

  const AddData = async (values: any) => {
    setLoading(true);

    const token = Cookies.get("token") || "";

    const payload = {
      ...values,
      premiered: values.premiered?.format("YYYY-MM-DD"),
      ended: values.ended?.format("YYYY-MM-DD"),
    };

    const { error } = await MoviesClient.CreateMoviesData(payload, token);

    if (error) {
      message.error(error);
      setLoading(false);
      return;
    }

    message.success("Create movie successfully");
    form.resetFields();
    setOpenAdd(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="w-auto h-full flex flex-col gap-3 m-5">
      <div>
        <h1 className="text-base font-bold text-blue-950">PT SIGMA</h1>
        <h1 className="font-extrabold text-blue-950">Pusat Data Movies</h1>
      </div>
      <div className="w-fit flex flex-row gap-5 ">
        <ButtonDefault
          text="Add Data"
          onClick={() => setOpenAdd(true)}
          className="bg-green-500"
        />

        <ButtonDefault
          text={"Sync Data"}
          onClick={() => SyncData()}
          htmlType={"submit"}
          loading={loading}
        />
      </div>

      <TableMovies loading={loading} setLoading={setLoading} />
      <div>
        <Modal
          open={openAdd}
          title="Add Movie"
          onCancel={() => setOpenAdd(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
          width={700}
          bodyStyle={{
            maxHeight: "65vh",
            overflowY: "auto",
            paddingRight: 16,
          }}
        >
          <Form layout="vertical" form={form} onFinish={AddData}>
            <Form.Item
              name="name"
              label="Movie Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="url" label="URL">
              <Input />
            </Form.Item>

            <Form.Item name="type" label="Type">
              <Select
                options={[
                  { value: "Scripted", label: "Scripted" },
                  { value: "Reality", label: "Reality" },
                ]}
              />
            </Form.Item>

            <Form.Item name="language" label="Language">
              <Input />
            </Form.Item>

            <Form.Item name="genres" label="Genres">
              <Select mode="tags" placeholder="Drama, Action, Comedy" />
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { value: "Running", label: "Running" },
                  { value: "Ended", label: "Ended" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="schedule_days"
              label="Schedule Days"
              rules={[{ required: true, message: "Schedule days is required" }]}
            >
              <Select mode="multiple" placeholder="Select days">
                <Select.Option value="Monday">Monday</Select.Option>
                <Select.Option value="Tuesday">Tuesday</Select.Option>
                <Select.Option value="Wednesday">Wednesday</Select.Option>
                <Select.Option value="Thursday">Thursday</Select.Option>
                <Select.Option value="Friday">Friday</Select.Option>
                <Select.Option value="Saturday">Saturday</Select.Option>
                <Select.Option value="Sunday">Sunday</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="runtime" label="Runtime (minutes)">
              <InputNumber className="w-full" />
            </Form.Item>

            <Form.Item name="average_runtime" label="Average Runtime">
              <InputNumber className="w-full" />
            </Form.Item>

            <Form.Item name="premiered" label="Premiered">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="ended" label="Ended">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="rating" label="Rating">
              <InputNumber min={0} max={10} step={0.1} className="w-full" />
            </Form.Item>

            <Form.Item name="image_url" label="Image URL">
              <Input />
            </Form.Item>

            <Form.Item name="summary" label="Summary">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default IndexCRUDMovies;
