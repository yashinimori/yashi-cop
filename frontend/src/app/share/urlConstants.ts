//const MAIN_URL = 'http://18.185.111.248';
export const MAIN_URL = 'https://api0.chargebackoptimizer.com';
//export const MAIN_URL = 'http://18.156.118.192';

export const URL_CREATE_TOKEN = `${MAIN_URL}/api/v1/auth/jwt/create`;
export const URL_USER_INFO = `${MAIN_URL}/api/v1/users/me`;

export const URL_GET_CLAIM_LIST = `${MAIN_URL}/api/v1/claims`;
export const URL_GET_CLAIM = `${MAIN_URL}/api/v1/claims`;
export const URL_CREATE_CLAIM = `${MAIN_URL}/api/v1/claims/`;

export const URL_GET_TRANSACTIONS_LIST = `${MAIN_URL}/api/v1/transactions`;

export const URL_UPLOAD_ATM_LOG = `${MAIN_URL}/api/v1/atm-logs/`;

export const URL_GET_MERCHANTS = `${MAIN_URL}/api/v1/merchants`;

export const URL_CREATE_NEW_USER = `${MAIN_URL}/api/v1/users/`;

// export const URL_GET_TIMELINE_INFO = `${MAIN_URL}/api/v1/claim/`;

export const URL_UPDATE_CLAIM = `${MAIN_URL}/api/v1/claims/`;
export const URL_UPLOAD_CLAIM_DOC = `${MAIN_URL}/api/v1/claim-documents/`;
export const URL_CLAIM = `${MAIN_URL}/api/v1/claim/`;
export const URL_CLAIM_DOC = `${MAIN_URL}/api/v1/claim/`;

export const URL_CREATE_NEW_BANK = `${MAIN_URL}/api/v1/banks/`;
export const URL_BANK = `${MAIN_URL}/api/v1/banks`;

export const URL_BANK_USERS = `${MAIN_URL}/api/v1/bank-employees`;

export const URL_RESET_PASS = `${MAIN_URL}/api/v1/users/reset_password/`;
export const URL_SET_PASS = `${MAIN_URL}/api/v1/users/set_password/`;
export const RESET_PASSWORD_CONFIRM = `${MAIN_URL}/api/v1/users/reset_password_confirm/`;


export const URL_GET_TIMELINE_INFO = `${MAIN_URL}/api/v1/claim`;
export const URL_USER_ACTIVATED = `${MAIN_URL}/api/v1/users/activation/`;


// api0.chargebackoptimizer.com/api/v1/bank/<pk>/stats/updated-claims/
// updated_claims - Количество обновленных претензий (претензии у которых менялся статус)
export const URL_BANK_COUNT_UPDATED_CLAIMS = `${MAIN_URL}/api/v1/bank/`;


// api0.chargebackoptimizer.com/api/v1/bank/<pk>/stats/
// new_claims - Количество новых претензий
// attend_to_claims - Количество претензий, требующих внимания (5 дней до due date)
// pre_mediation_claims, mediation_claims, ... , closed_claims - Количество претензий в разрезе стадий
export const URL_BANK_COUNT_NEW_CLAIMS = `${MAIN_URL}/api/v1/bank/`;


// api0.chargebackoptimizer.com/api/v1/stats/updated_claims
// updated_claims - Количество обновленных претензий (претензии у которых менялся статус)
export const URL_COUNT_UPDATED_CLAIMS = `${MAIN_URL}/api/v1/stats/updated-claims`;

// api0.chargebackoptimizer.com/api/v1/stats/
// new_claims - Количество новых претензий
// attend_to_claims -Количество претензий, требующих внимания (5 дней до due date)
export const URL_COUNT_NEW_CLAIMS = `${MAIN_URL}/api/v1/stats`;

// api0.chargebackoptimizer.com/api/v1/stats/by-status-stages
// pre_mediation_claims, mediation_claims, ... , closed_claims - Количество претензий в разрезе стадий(все в статусе closed за период)
export const URL_COUNT_CLAIMS_BY_STAGES = `${MAIN_URL}/api/v1/stats/by-status-stages`;

// api0.chargebackoptimizer.com/api/v1/stats/by-rc-group/
// fraud_claims, authorization_claims, ... , cardholder_disputes_claims
// Количество претензий в разрезе типов RC (fraud, auth etc) (все в статусе closed за период)
export const URL_COUNT_CLAIMS_BY_RC_GROUP = `${MAIN_URL}/api/v1/stats/by-rc-group/`;

// api0.chargebackoptimizer.com/api/v1/stats/by-support/
// them_on_us, us_on_them, us_on_us - Количество претензий в разрезе us-on-us, us-on-them, them on us (все в статусе closed за период)
export const URL_COUNT_CLAIMS_BY_SUPPORT = `${MAIN_URL}/api/v1/stats/by-support/`;

// ?end-date=&start_date=
// для временного периода

export const URL_CREATE_NEW_ATM = `${MAIN_URL}/api/v1/atms/`;
export const URL_GET_ATMS = `${MAIN_URL}/api/v1/atms/`;

export const URL_GET_LOGGER = `${MAIN_URL}/api/v1/logger/`;
