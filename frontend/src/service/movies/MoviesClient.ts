import { Service } from "..";

export default class MoviesClient {
  static async Login(body: {}) {
    const { response, error, errorMessage } = await Service.post(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_LOGIN_URL}`,
      body,
      {}
    );

    return { response, error, errorMessage };
  }

  static async SyncMoviesData(body: {}, token: {}) {
    const { response, error, errorMessage } = await Service.get(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_SYNC_MOVIES_URL}`,
      body,
      token
    );

    return { response, error, errorMessage };
  }
  static async GetMoviesData(body: {}, token: {}) {
    const { response, error, errorMessage } = await Service.get(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_GET_MOVIES_URL}`,
      body,
      token
    );

    return { response, error, errorMessage };
  }

  static async GetMoviesDataDetail(param: string, token: {}) {
    const { response, error, errorMessage } = await Service.get(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_GET_MOVIES_URL}/${param}`,
      {},
      token
    );

    return { response, error, errorMessage };
  }

  static async CreateMoviesData(body: {}, token: {}) {
    const { response, error, errorMessage } = await Service.post(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_CREATE_MOVIES_URL}`,
      body,
      token
    );

    return { response, error, errorMessage };
  }

  static async UpdateMoviesData(body: {}, token: {}) {
    const { response, error, errorMessage } = await Service.post(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_UPDATE_MOVIES_URL}`,
      body,
      token
    );

    return { response, error, errorMessage };
  }

  static async DeleteMoviesData(param: {}, token: {}) {
    const { response, error, errorMessage } = await Service.delete(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_DELETE_MOVIES_URL}/${param}`,
      {},
      token
    );

    return { response, error, errorMessage };
  }

  static async GetMoviesDataDashboard(params: Record<string, any>, token: {}) {
    const { response, error, errorMessage } = await Service.get(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BASE_GET_DASHBOARD_MOVIES_URL}`,
      params,
      token
    );

    return { response, error, errorMessage };
  }
}
