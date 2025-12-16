import {get, post} from '/@/utils/http/axios';

enum URL {
  list = '/api/coupon/list',
  create = '/api/coupon/create',
  update = '/api/coupon/update',
  delete = '/api/coupon/delete',
  check = '/api/coupon/check',
  receive = '/api/coupon/receive',
}

const listApi = async (params: any) =>
    get<any>({url: URL.list, params: params, data: {}, headers: {}});

const createApi = async (data: any) =>
    post<any>({
      url: URL.create,
      params: {},
      data: data,
      headers: {'Content-Type': 'multipart/form-data;charset=utf-8'}
    });

const updateApi = async (params: any, data: any) =>
    post<any>({
      url: URL.update,
      params: params,
      data: data,
      headers: {'Content-Type': 'multipart/form-data;charset=utf-8'}
    });

const deleteApi = async (params: any) =>
    post<any>({url: URL.delete, params: params, headers: {}});

const checkApi = async (params: any) =>
    get<any>({url: URL.check, params: params, data: {}, headers: {}});

const receiveApi = async (data: any) =>
    post<any>({
      url: URL.receive,
      params: {},
      data: data,
      headers: {'Content-Type': 'multipart/form-data;charset=utf-8'}
    });

export {listApi, createApi, updateApi, deleteApi, checkApi, receiveApi};
