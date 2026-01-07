import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import { Column } from "@ant-design/plots";
import Cookies from "js-cookie";
import MoviesClient from "../../service/movies/MoviesClient";
import { Card, Col, DatePicker, message, Row, Spin, Statistic } from "antd";
import type { Dayjs } from "dayjs";

function IndexMovies() {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  useEffect(() => {
    fetchDashboard();
  }, [dateRange]);

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const token = Cookies.get("token") || "";
      const params: Record<string, string> = {};

      if (dateRange?.[0] && dateRange?.[1]) {
        params.start_date = dateRange[0].format("YYYY-MM-DD");
        params.end_date = dateRange[1].format("YYYY-MM-DD");
      }

      const { response } = await MoviesClient.GetMoviesDataDashboard(
        params,
        token
      );

      setDashboard(response);
    } catch (error) {
      message.error("Fetch dashboard error");
    } finally {
      setLoading(false);
    }
  };
  const rawPie = dashboard?.pieChart ?? [];

  const totalAll = rawPie.reduce(
    (sum: number, item: any) => sum + Number(item.total),
    0
  );

  const pieData = rawPie.map((item: any) => ({
    type: item.type,
    percentage: totalAll
      ? Number(((Number(item.total) / totalAll) * 100).toFixed(1))
      : 0,
  }));

  const pieConfig = {
    data: pieData,
    angleField: "percentage",
    colorField: "type",
    radius: 0.8,
    label: {
      text: "percentage",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  const columnConfig = {
    data: dashboard?.columnChart ?? [],
    xField: "date",
    yField: "total",
    xAxis: {
      label: { autoRotate: true },
    },
  };

  return (
    <div className="w-auto h-full flex flex-col gap-3 m-5">
      <div>
        <h1 className="text-base font-bold text-blue-950">PT SIGMA</h1>
        <h1 className="font-extrabold text-blue-950">Dashboard Data Movies</h1>
      </div>

      <DatePicker.RangePicker
        allowClear
        onChange={(dates) => {
          if (dates?.[0] && dates?.[1]) {
            setDateRange([dates[0], dates[1]]);
          } else {
            setDateRange(null);
          }
        }}
      />

      <Spin spinning={loading}>
        <div className="space-y-6">
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Movies"
                  value={dashboard?.summary?.total ?? 0}
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card>
                <Statistic
                  title="Most Category"
                  value={dashboard?.summary?.mostCategory?.type ?? "-"}
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Latest Data">
                {dashboard?.summary?.latest?.length ? (
                  dashboard.summary.latest.map((item: any) => (
                    <div key={item.id}>
                      {item.name} ({item.type})
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No data</div>
                )}
              </Card>
            </Col>
          </Row>

          {/* CHARTS */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Movie By Genre">
                <Pie {...pieConfig} />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Daily Movies Trend">
                <Column {...columnConfig} />
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
}

export default IndexMovies;
