class ReasonCodes:
    NO_CARDHOLDER_AUTHORIZATION = 4837
    FRAUDULENT_PROCESSING_OF_TRANSACTIONS = 4840
    QUESTIONABLE_MERCHANT_ACTIVITY = 4849
    CARDHOLDER_DOES_NOT_RECOGNIZE_POTENTIAL_FRAUD = 4863
    CHIP_LIABILITY_SHIFT = 4870
    CHIP_OR_PIN_LIABILITY_SHIFT = 4871
    WARNING_BULLETIN_FILE = 4807
    AUTHORIZATION_RELATED_CHARGEBACK = 4808
    ACCOUNT_NUMBER_NOT_ON_FILE = 4812
    POINT_OF_INTERACTION_ERROR = 4834
    TRANSACTION_AMOUNT_DIFFERS = 4831
    LATE_PRESENTMENT_MS = 4842
    CORRECT_TRANSACTION_CURRENCY_CODE_NOT_PROVIDED = 4846
    INSTALLMENT_BILLING_DISPUTE = 4850
    DOMESTIC_CHARGEBACK_DISPUTE_EUROPE_REGION_ONLY = 4999
    CARDHOLDER_DISPUTE = 4853
    CANCELED_RECURRING_OR_DIGITAL_GOODS_TRANSACTIONS = 4841
    CARDHOLDER_DISPUTE_NOT_ELSEWHERE_CLASSIFIED_US_REGION_ONLY = 4854
    GOODS_OR_SERVICES_NOT_PROVIDED = 4855
    ADDENDUM_NO_SHOW_OR_ATM_DISPUTE = 4859
    CREDIT_NOT_PROCESSED_MS = 4860
    EMV_LIABILITY_SHIFT_NON_COUNTERFEIT_FRAUD = 101
    OTHER_FRAUD_CARD_PRESENT_ENVIRONMENT_CONDITION = 103
    OTHER_FRAUD_CARD_ABSENT_ENVIRONMENT_CONDITION = 104
    VISA_FRAUD_MONITORING_PROGRAM = 105
    CARD_RECOVERY_BULLETIN = 111
    DECLINED_AUTHORIZATION = 112
    NO_AUTHORIZATION = 113
    LATE_PRESENTMENT_VISA = 121
    INCORRECT_TRANSACTION_CODE = 122
    INCORRECT_CURRENCY = 123
    INCORRECT_ACCOUNT_NUMBER = 124
    INCORRECT_AMOUNT = 125
    DUPLICATE_PROCESSING_PAID_BY_OTHER_MEANS = 126
    INVALID_DATA = 127
    MERCHANDISE_SERVICES_NOT_RECEIVED = 131
    CANCELED_RECURRING_TRANSACTION = 132
    NOT_AS_DESCRIBED_OR_DEFECTIVE_MERCHANDISE_SERVICES = 133
    COUNTERFEIT_MERCHANDISE = 134
    MISREPRESENTATION = 135
    CREDIT_NOT_PROCESSED_VISA = 136
    CANCELLED_MERCHANDISE_SERVICES = 137
    ORIGINAL_CREDIT_TRANSACTION_NOT_ACCEPTED = 138
    NON_RECEIPT_OF_CASH_OR_LOAD_TRANSACTION_VALUE = 139


class ReasonCodesGroups:

    ATM_CASH_NOT_RECEIVED = {
        "code": "0001",
        "VISA": 139,
        "MasterCard": 4834,
        "description": "ATM CASH NOT RECEIVED",
    }
    ORIGINAL_CREDIT_TRANSACTION_NOT_ACCEPTED = {
        "code": "0002",
        "VISA": 138,
        "MasterCard": 4853,
        "description": "Original Credit Transaction Not Accepted",
    }
    CANCELLED_MERCHANDISE_OR_SERVICES = {
        "code": "0003",
        "VISA": 137,
        "MasterCard": 4853,
        "description": "Cancelled Merchandise/Services",
    }
    CREDIT_NOT_PROCESSED = {
        "code": "0004",
        "VISA": 136,
        "MasterCard": 4853,
        "description": "Credit Not Processed",
    }
    MISREPRESENTATION = {
        "code": "0005",
        "VISA": 135,
        "MasterCard": 4853,
        "description": "Misrepresentation",
    }
    COUNTERFEIT_MERCHANDISE = {
        "code": "0006",
        "VISA": 134,
        "MasterCard": 4853,
        "description": "Counterfeit Merchandise",
    }
    NOT_AS_DESCRIBED_OR_DEFECTIVE_MERCHANDISE_OR_SERVICES = {
        "code": "0007",
        "VISA": 133,
        "MasterCard": 4853,
        "description": "Not as Described or Defective Merchandise/Services",
    }
    CANCELED_RECURRING_TRANSACTION = {
        "code": "0008",
        "VISA": 132,
        "MasterCard": 4853,
        "description": "Canceled Recurring Transaction",
    }
    MERCHANDISE_OR_SERVICES_NOT_RECEIVED = {
        "code": "0009",
        "VISA": 131,
        "MasterCard": 4853,
        "description": "Merchandise/Services Not Received",
    }
    INVALID_DATA = {
        "code": "0010",
        "VISA": 127,
        "MasterCard": 4808,
        "description": "Invalid Data",
    }
    DUPLICATE_PROCESSING = {
        "code": "0011",
        "VISA": 126,
        "MasterCard": 4834,
        "description": "Duplicate Processing",
    }
    INCORRECT_AMOUNT = {
        "code": "0012",
        "VISA": 125,
        "MasterCard": 4834,
        "description": "Incorrect Amount",
    }
    INCORRECT_ACCOUNT_NUMBER = {
        "code": "0013",
        "VISA": 124,
        "MasterCard": 4808,
        "description": "Incorrect Account Number",
    }
    INCORRECT_CURRENCY = {
        "code": "0014",
        "VISA": 123,
        "MasterCard": 4834,
        "description": "Incorrect Currency",
    }
    INCORRECT_TRANSACTION_CODE = {
        "code": "0015",
        "VISA": 122,
        "MasterCard": 4853,
        "description": "Incorrect Transaction Code",
    }
    LATE_PRESENTMENT = {
        "code": "0016",
        "VISA": 121,
        "MasterCard": 4808,
        "description": "Late Presentment",
    }
    NO_AUTHORIZATION = {
        "code": "0017",
        "VISA": 113,
        "MasterCard": 4808,
        "description": "No Authorization",
    }
    DECLINED_AUTHORIZATION = {
        "code": "0018",
        "VISA": 112,
        "MasterCard": 4808,
        "description": "Declined Authorization",
    }
    CARD_RECOVERY_BULLETIN = {
        "code": "0019",
        "VISA": 111,
        "MasterCard": 4808,
        "description": "Card Recovery Bulletin",
    }
    FRAUD_MONITORING_PROGRAM = {
        "code": "0020",
        "VISA": 105,
        "MasterCard": 4837,
        "description": "Fraud Monitoring Program",
    }
    OTHER_FRAUD_CARD_ABSENT_ENVIRONMENT_OR_CONDITION = {
        "code": "0021",
        "VISA": 104,
        "MasterCard": 4837,
        "description": "Other Fraud: Card-absent Environment/Condition",
    }
    OTHER_FRAUD_CARD_PRESENT_ENVIRONMENT_OR_CONDITION = {
        "code": "0022",
        "VISA": 103,
        "MasterCard": 4837,
        "description": "Other Fraud: Card-Present Environment/Condition",
    }
    EMV_LIABILITY_SHIFT_NON_COUNTERFEIT_FRAUD = {
        "code": "0023",
        "VISA": 102,
        "MasterCard": 4837,
        "description": "EMV Liability Shift Non-Counterfeit Fraud",
    }
    EMV_LIABILITY_SHIFT_COUNTERFEIT_FRAUD = {
        "code": "0024",
        "VISA": 101,
        "MasterCard": 4837,
        "description": "EMV Liability Shift Counterfeit Fraud",
    }
    CHARGES_FOR_LOSS_THEFT_OR_DAMAGES = {
        "code": "0025",
        "MasterCard": 4834,
        "description": "Charges for Loss, Theft, or Damages",
    }
    NO_SHOW_HOTEL_CHARGE = {
        "code": "0026",
        "MasterCard": 4834,
        "description": "“No-Show” Hotel Charge",
    }
    PAID_BY_OTHER_MEANS = {
        "code": "0027",
        "VISA": 126,
        "MasterCard": 4834,
        "description": "Paid by Other Means",
    }
    REQUEST_FOR_DOCUMENTS = {
        "code": "0100",
        "description": "Original Credit Transaction Not Accepted",
    }
    REQUEST_FOR_PERSONAL_LOG = {
        "code": "0101",
        "description": "Запит документів",
    }
    ANOTHER_REASON = {
        "code": "0500",
        "description": "запитна проаналізований лог",
    }

    REASON_CODES_GROUPS = {
        "0001": ATM_CASH_NOT_RECEIVED,
        "0002": ORIGINAL_CREDIT_TRANSACTION_NOT_ACCEPTED,
        "0003": CANCELLED_MERCHANDISE_OR_SERVICES,
        "0004": CREDIT_NOT_PROCESSED,
        "0005": MISREPRESENTATION,
        "0006": COUNTERFEIT_MERCHANDISE,
        "0007": NOT_AS_DESCRIBED_OR_DEFECTIVE_MERCHANDISE_OR_SERVICES,
        "0008": CANCELED_RECURRING_TRANSACTION,
        "0009": MERCHANDISE_OR_SERVICES_NOT_RECEIVED,
        "0010": INVALID_DATA,
        "0011": DUPLICATE_PROCESSING,
        "0012": INCORRECT_AMOUNT,
        "0013": INCORRECT_ACCOUNT_NUMBER,
        "0014": INCORRECT_CURRENCY,
        "0015": INCORRECT_TRANSACTION_CODE,
        "0016": LATE_PRESENTMENT,
        "0017": NO_AUTHORIZATION,
        "0018": DECLINED_AUTHORIZATION,
        "0019": CARD_RECOVERY_BULLETIN,
        "0020": FRAUD_MONITORING_PROGRAM,
        "0021": OTHER_FRAUD_CARD_ABSENT_ENVIRONMENT_OR_CONDITION,
        "0022": OTHER_FRAUD_CARD_PRESENT_ENVIRONMENT_OR_CONDITION,
        "0023": EMV_LIABILITY_SHIFT_NON_COUNTERFEIT_FRAUD,
        "0024": EMV_LIABILITY_SHIFT_COUNTERFEIT_FRAUD,
        "0025": CHARGES_FOR_LOSS_THEFT_OR_DAMAGES,
        "0026": NO_SHOW_HOTEL_CHARGE,
        "0027": PAID_BY_OTHER_MEANS,
        "0100": REQUEST_FOR_DOCUMENTS,
        "0101": REQUEST_FOR_PERSONAL_LOG,
        "0500": ANOTHER_REASON,
    }
