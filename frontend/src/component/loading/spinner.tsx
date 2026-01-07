import React from "react";
import { Alert, Flex, Spin } from "antd";

interface LoadingComponentProps {
  message?: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
  spinning?: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  message = "",
  description = "",
  type = "info",
  spinning = false,
}) => (
  <Flex gap="middle" vertical>
    <Spin tip="Loading..." spinning={spinning} size="large">
      <Alert
        message={message}
        description={description}
        type={type}
        className="w-full h-[10rem] bg-blue-200 "
      />
    </Spin>
  </Flex>
);

export default LoadingComponent;
