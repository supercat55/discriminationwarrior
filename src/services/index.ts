import { request } from '@umijs/max';

/**
 * 获取zipCode和state关联关系
 * @returns 
 */
export const queryConnectionZipCodeState = async(): Promise<Rule[]> => {
  return request('/data/Connection_Zipcode_State_json.json');
}

/**
 * 获取interest country数据
 * @returns 
 */
export const queryInterestCountryByZipCode = async(zipCode: string): Promise<Option[]> => {
  return request(`/data/interest_json/Zipcode_interest_json_${zipCode}.json`, {
    skipErrorHandler: true
  });
}

/**
 * 获取rejection country数据
 * @returns 
 */
export const queryRejectionCountryByZipCode = async(zipCode: string): Promise<Option[]> => {
  return request(`/data/rejection_json/Zipcode_rejection_json_${zipCode}.json`);
}


/**
 * 获取interest state数据
 * @returns 
 */
export const queryInterestStateByState = async(state: string): Promise<Option[]> => {
  return request(`/data/state_id_json/State_interest_json_${state}.json`);
}

/**
 * 获取其他4个对比数据
 * @returns 
 */
export const queryCompareData = async(type: string): Promise<Option[]> => {
  return request(`/data/compare/${type}.json`);
}