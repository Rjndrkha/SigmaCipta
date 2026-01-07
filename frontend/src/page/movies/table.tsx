import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { GetRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Modal, Space, Table, message } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { Spin, Descriptions } from "antd";
import Highlighter from "react-highlight-words";
import Cookies from "js-cookie";
import { IMovies } from "../../interface/IMovies";
import MoviesClient from "../../service/movies/MoviesClient";
import ButtonDefault from "../../component/button/button";
import { DateFormatter } from "../../utils/dateConverter";
import { Form, Select, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { url } from "inspector";

type InputRef = GetRef<typeof Input>;
type DataIndex = keyof IMovies;

const TableMovies: React.FC<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}> = ({ loading, setLoading }) => {
  const [movies, setMovies] = useState<IMovies[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [movieDetail, setMovieDetail] = useState<IMovies | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovies | null>(null);
  const [form] = Form.useForm();
  const token = Cookies.get("token") || "";

  useEffect(() => {
    getListMovies();
  }, [page, limit]);

  const getListMovies = async () => {
    setLoading(true);
    const token = Cookies.get("token") || "";

    const { error, errorMessage, response } = await MoviesClient.GetMoviesData(
      { page, limit },
      token
    );

    if (error) {
      message.error(errorMessage || "Failed to get data");
      setMovies([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    if (response) {
      setMovies(response.data);
      setTotal(response.meta.total);
    }

    setLoading(false);
  };

  const handleShow = async (id: number | string) => {
    setOpen(true);
    setLoadingDetail(true);
    setMovieDetail(null);

    const token = Cookies.get("token") || "";

    const { response, error, errorMessage } =
      await MoviesClient.GetMoviesDataDetail(id.toString(), token);

    if (error) {
      message.error(errorMessage || "Failed to load movie detail");
      setLoadingDetail(false);
      return;
    }

    setMovieDetail(response);
    setLoadingDetail(false);
  };

  const handleDelete = async (id: number | string) => {
    const token = Cookies.get("token") || "";

    const { response, error, errorMessage } =
      await MoviesClient.DeleteMoviesData(id.toString(), token);

    if (error) {
      message.error(errorMessage || "Failed to load movie detail");
      return;
    }

    if (response) {
      message.info(response.message);
      getListMovies();
    }
  };

  const handleUpdate = async (id: string) => {
    setLoadingDetail(true);

    const { response } = await MoviesClient.GetMoviesDataDetail(id, token);
    if (response) {
      const data = response;
      form.setFieldsValue({
        id: data.id,
        url: data.url,
        name: data.name,
        type: data.type,
        language: data.language,
        status: data.status,
        genres: data.genres.split(","),
        schedule_days: data.schedule_days.split(","),
        runtime: data.runtime,
        average_runtime: data.average_runtime,
        premiered: data.premiered ? dayjs(data.premiered) : null,
        ended: data.ended ? dayjs(data.ended) : null,
        rating: data.rating,
        image_url: data.image_url,
        summary: data.summary,
      });

      setOpenUpdate(true);
      setLoadingDetail(false);
    }
  };

  const onUpdateSubmit = async (values: any) => {
    const payload = {
      ...values,
      premiered: values.premiered.format("YYYY-MM-DD"),
      ended: values.ended ? values.ended.format("YYYY-MM-DD") : null,
      genres: values.genres.join(","),
      schedule_days: values.schedule_days.join(","),
    };

    await MoviesClient.UpdateMoviesData(payload, token);
    setOpenUpdate(false);
    getListMovies();
    message.info("Berhasil Update");
  };

  const handleTableChange = (pagination: any) => {
    if (pagination.current !== page) setPage(pagination.current);
    if (pagination.pageSize !== limit) setLimit(pagination.pageSize);
  };

  const loadData = (data: IMovies[]) => {
    return data.map((item) => {
      return {
        ...item,
        Action: (
          <div className="flex justify-center gap-5">
            {/* <ButtonDefault
              color="#f4b63c"
              text={"Edit"}
              onClick={() => {
                window.location.href = `/content/edit/${item.id_promo}`;
              }}
              />
              
            <ButtonDefault
              color="#2a9928"
              text={"Show"}
              // onClick={() => {
              //   window.location.href = `/content/show/${item.id_promo}`;
              // }}
            />
              */}
          </div>
        ),
      };
    });
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (
    clearFilters: () => void,
    confirm: FilterDropdownProps["confirm"]
  ) => {
    clearFilters();
    setSearchText("");
    getListMovies();
    confirm();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<IMovies> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current, 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<IMovies> = [
    {
      title: "Judul Film",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      align: "center",
    },

    {
      title: "Genre",
      dataIndex: "genres",
      key: "genres",
      ...getColumnSearchProps("genres"),
      align: "center",
    },
    {
      title: "Runtime",
      dataIndex: "average_runtime",
      key: "average_runtime",
      ...getColumnSearchProps("average_runtime"),
      align: "center",
    },
    {
      title: "Schedule",
      dataIndex: "schedule_days",
      key: "schedule_days",
      ...getColumnSearchProps("schedule_days"),
      align: "center",
    },
    {
      title: "Last Sync Time",
      dataIndex: "created_at",
      key: "created_at",
      ...getColumnSearchProps("created_at"),
      align: "center",
      render: (date: any) => DateFormatter(date),
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_: any, record: IMovies) => (
        <div className="flex justify-center gap-5">
          <ButtonDefault text="Show" onClick={() => handleShow(record.id)} />
          <ButtonDefault
            text="Update"
            onClick={() => handleUpdate(String(record.id))}
            className="bg-yellow-500"
          />
          <ButtonDefault
            text="Delete"
            className="bg-red-500"
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        loading={loading}
        size="small"
        columns={columns}
        dataSource={loadData(movies)}
        style={{ overflow: "auto", textAlign: "center" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={handleTableChange}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Movie Detail"
        width={600}
        centered
      >
        {loadingDetail ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : movieDetail ? (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Title">
              {movieDetail.name}
            </Descriptions.Item>

            <Descriptions.Item label="Poster">
              {movieDetail.image_url && (
                <img
                  src={movieDetail.image_url}
                  alt={movieDetail.name}
                  style={{ maxWidth: "20%", height: "auto" }}
                />
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Premiered">
              {movieDetail.premiered}
            </Descriptions.Item>

            <Descriptions.Item label="Genre">
              {movieDetail.genres}
            </Descriptions.Item>

            <Descriptions.Item label="Language">
              {movieDetail.language}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              {movieDetail.status}
            </Descriptions.Item>

            <Descriptions.Item label="Summary">
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
                dangerouslySetInnerHTML={{ __html: movieDetail.summary }}
              />
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p className="text-center text-red-500">No data available</p>
        )}
      </Modal>

      <Modal
        open={openUpdate}
        onCancel={() => {
          setOpenUpdate(false);
          form.resetFields();
        }}
        title="Update Movie"
        width={700}
        footer={null}
        destroyOnClose
      >
        {loadingDetail ? (
          <div className="text-center py-10">
            <Spin />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onUpdateSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item hidden name="id" label="id">
                <Input />
              </Form.Item>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="url" label="url" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: "Scripted" },
                    { value: "Reality" },
                    { value: "Animation" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select options={[{ value: "Running" }, { value: "Ended" }]} />
              </Form.Item>
            </div>

            <Form.Item
              name="genres"
              label="Genres"
              rules={[{ required: true }]}
            >
              <Select mode="tags" />
            </Form.Item>

            <Form.Item
              name="schedule_days"
              label="Schedule Days"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                options={[
                  { value: "Monday" },
                  { value: "Tuesday" },
                  { value: "Wednesday" },
                  { value: "Thursday" },
                  { value: "Friday" },
                  { value: "Saturday" },
                  { value: "Sunday" },
                ]}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="runtime"
                label="Runtime"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item
                name="average_runtime"
                label="Average Runtime"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="premiered"
                label="Premiered"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item name="ended" label="Ended">
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <Form.Item name="rating" label="Rating">
              <InputNumber min={0} max={10} className="w-full" />
            </Form.Item>

            <Form.Item
              name="image_url"
              label="Image URL"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="summary" label="Summary">
              <Input.TextArea rows={4} />
            </Form.Item>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loadingUpdate}>
                Update
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default TableMovies;
