class CustomError extends Error {
  message: string;
  statusCode: number;
  from?: string;

  constructor(
    {
      message,
      statusCode,
    }: {
      message: string;
      statusCode: number;
    },
    from?: string
  ) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.from = from;
  }
}

export default CustomError;

type ErrorMessageKeys =
  | "UKNOWN_ERROR"
  | "FAIL_TO_CONNECT_DB"
  | "INVALID_REQUEST_INPUT"
  | "MILVUS_CLIENT_ERROR";

const TO_CLIENT_MESSAGE: { [key in ErrorMessageKeys]: string } = {
  UKNOWN_ERROR: "SERVER_ERROR",
  FAIL_TO_CONNECT_DB: "SERVER_ERROR",
  INVALID_REQUEST_INPUT: "API_REQUEST_ERROR",
  MILVUS_CLIENT_ERROR: "SERVER_ERROR",
};

const getErrorArgs = (key: ErrorMessageKeys) => {
  const mapKeyToError: {
    [key in ErrorMessageKeys]: {
      statusCode: number;
    };
  } = {
    UKNOWN_ERROR: {
      statusCode: 500,
    },
    FAIL_TO_CONNECT_DB: {
      statusCode: 500,
    },
    INVALID_REQUEST_INPUT: {
      statusCode: 400,
    },
    MILVUS_CLIENT_ERROR: {
      statusCode: 500,
    },
  };
  return { ...mapKeyToError[key], message: TO_CLIENT_MESSAGE[key] };
};

export { getErrorArgs };
