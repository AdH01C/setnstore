import { ApiException } from "@inquisico/ruleset-editor-api";
import { notification } from "antd";

import { MessageHeader } from "../constants/messages/common";
import { ErrorMessages } from "../constants/messages/messages";

export function errorResponseHandler(error: unknown, customMessageBody?: { title?: string; detail?: string }) {
  const defaultTitle = customMessageBody?.title ?? MessageHeader.ERROR;
  const defaultDescription = customMessageBody?.detail ?? ErrorMessages.DEFAULT_ERROR;

  if (error instanceof ApiException) {
    const { body } = error as ApiException<{ title: string; detail: string }>;
    notification.error({
      message: body.title ?? defaultTitle,
      description: body.detail ?? defaultDescription,
      placement: "bottomRight",
    });
  } else {
    notification.error({
      message: defaultTitle,
      description: defaultDescription,
      placement: "bottomRight",
    });
  }
}
