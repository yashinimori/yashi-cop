# -*- coding: utf-8 -*-
"""
Created on Wed Apr 11 17:49:43 2018

@author: Kirill
"""

import csv

FILE_PATH = '/Users/angry_rat/ATM/Data/'
FILE_PATH_SUCCESFUL = '/Users/angry_rat/ATM/Data/Succesful/'
FILE_PATH_NEUTRAL = '/Users/angry_rat/ATM/Data/Neutral/'
FILE_PATH_FAILED = '/Users/angry_rat/ATM/Data/Failed/'
FILE_PATH_REPORT = '/Users/angry_rat/ATM/Data/Report/'
SUCCESFUL_STATUS = 'SUCCESFUL'
NEUTRAL_STATUS = 'NEUTRAL'
FAILED_STATUS = 'FAILED'


#FILE_NAME = '4508 8464-20161125-065747-231211-TOP.ENC[2].txt'
FILE_NAME = '7301 8707-20161217-001216-133121-TOP.ENC[2].txt'


MARK_0 = 'TRANSACTION START'
MARK_1 = 'TRANSACTION END'
MARK_2 = 'CASH TAKEN'
MARK_3 = '----------'
MARK_FAILED = [
        'EXCEEDED DAILY LIMIT',
        'LIMIT EXCEEDED',
        'CAN NOT PROCESS',
        'INCORRECT PIN',
        'YOUR ISSUER IS NOT', 
        'CANNOT PROCESS TRANSACTION',
        'INSUFFICIENT FUNDS',
        'TRANSACTION IS NOT',
        'CANNOT PROCESS AMOUNT',
        'COMMUNICATION ERROR'
        ]
BROCKEN_BLOCK_LENGTH = 4
REPORT = [['SEQ Number', 'Tran date', 'Tran time', 'ATM', 'Amount', 'Currency', 'Card', 'Auth code', 'Status']]


def temp_trans(temp_tank):
    from copy import deepcopy
    temp = deepcopy(temp_tank)
    return temp
    
    
def separate_transaction(FILE_PATH, FILE_NAME, MARK_0, MARK_1):
    temp_tank = list()
    result_list = list()
    data_file = FILE_PATH + FILE_NAME
    with open(data_file, 'r', encoding='utf-8-sig') as file_to_read:
        for line in file_to_read:
            if MARK_0 in line:
                temp_tank.append(line)
            elif MARK_1 in line:
                temp_tank.append(line)
#                print(len(temp_tank))
                result_list.append(temp_trans(temp_tank))
                temp_tank.clear()
            else:
                temp_tank.append(line)                
    return result_list


def clean_first_raws(transaction_list):
    for I in range(len(transaction_list)):
        for item in transaction_list[I]:
            if 'TRANSACTION START' in item:
                transaction_list[I] = transaction_list[I][transaction_list[I].index(item):]
    return transaction_list

            
def pagination_cleaner(transaction):
    for raw in transaction:
        if '----------------------- Page' in raw:
            ind = transaction.index(raw)
            return transaction[:ind - 3] + transaction[ind + 4:]
    return transaction
    

def clean_midle_raws(transaction_list):
    temp_list = list()
    for I in range(len(transaction_list)):
        temp_list.append(pagination_cleaner(transaction_list[I]))
    return temp_list


def search_for_failed(transaction, MARK_FAILED):
    temp = None
    for raw in transaction:
        for mark in MARK_FAILED:
            if mark in raw:
                temp = transaction
            else:
                continue
    return temp

    
def search_for_taken(transaction, MARK_2):
    temp = None
    for raws in transaction:
        if MARK_2 in raws:
            temp = transaction
        else:
            continue
    return temp


def legend_getting(list2):
    result = list()
    n = -1
    raw = list2[n]
    while raw.strip(' \t\n\r') != MARK_3:
        result.append(raw.strip(' \t\n\r'))
        n -= 1
        try:
            raw = list2[n]
        except IndexError:
            break
#        print(n, result)
    return list(reversed(result))


def get_atm_id_date(raw):
    id_tr =  raw.split()[0]
    date = raw.split()[1]
    atm = raw.split()[3]
    return atm, id_tr, date


def get_total_curr(raw):
    
    try:
        total = raw.split()[3]
    except IndexError:
        total = 'None'
    
    try:
        curr = raw.split()[4]
    except IndexError:
        curr = 'None'
        
    try:
        time = raw.split()[0]
    except IndexError:
        time = 'None'
               
    return total, curr, time


def get_code(raw):
    code = raw.split()[2]
    return code


def prepare_legend(legend_list, SUCCESFUL_STATUS):
    result = {'SEQ Number':'',
              'Tran date':'',
              'Tran time':'',
              'ATM':'',
              'Amount':'',
              'Currency':'',
              'Card':'',
              'Auth code':'',
              'Result': SUCCESFUL_STATUS}
    for raw in legend_list:
        if 'ATM:' in raw:
            result['ATM'], result['SEQ Number'], result['Tran date'] = get_atm_id_date(raw)
        elif 'CASH WITHDRAWAL' in raw:
            result['Amount'], result['Currency'], result['Tran time'] = get_total_curr(raw)
            result['Card'] = legend_list[legend_list.index(raw) + 2].split()[0]#идем на 2 строки ниже за номерром карты
        elif 'AUTH. CODE:' in raw:
            result['Auth code'] = get_code(raw)
    return result


def file_name(succesful_list, SUCCESFUL_STATUS):
    temp_raw = ''
    temp_dict = prepare_legend(succesful_list, SUCCESFUL_STATUS)
#    for key in ['SEQ Number', 'Tran date', 'Tran time', 'ATM', 'Amount', 'Currency', 'Card', 'Auth code', 'Result']:
    for key in ['SEQ Number', 'ATM', 'Card', 'Result']:
        temp_raw += (temp_dict[key] + '_')
    return temp_raw
    

#def prepare_legend(legend_list):
#    result = {'SEQ Number':'',
#              'Tran date':'',
#              'Tran time':'',
#              'ATM':'',
#              'Amount':'',
#              'Currency':'',
#              'Card':'',
#              'Auth code':'',
#              'Result': MARK_2}
#    for raw in legend_list:
#        if 'ATM:' in raw:
#            result['ATM'], result['SEQ Number'], result['Tran date'] = get_atm_id_date(raw)
#        elif 'CASH WITHDRAWAL' in raw:
#            result['Amount'], result['Currency'], result['Tran time'] = get_total_curr(raw)
#            result['Card'] = legend_list[legend_list.index(raw) + 2].split()[0]#идем на 2 строки ниже за номерром карты
#        elif 'AUTH. CODE:' in raw:
#            result['Auth code'] = get_code(raw)
#    return result
    

def write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL, SUCCESFUL_STATUS):
    data_to_write = [list1, list2, list3]
    with open(FILE_PATH_SUCCESFUL + file_number + '_' + 'file' + '.txt', 'a') as output:
        for key in prepare_legend(legend_getting(list2), SUCCESFUL_STATUS).keys():
            output.write(key + ': ' + prepare_legend(legend_getting(list2), SUCCESFUL_STATUS)[key] + '\n')
        output.write('\n')
        for data in data_to_write:
            for raw in data:
                output.write(raw)
            output.write('****'*45 + '\n')
            output.write('\n')
       

def build_files_with_taken(transaction_list):
    for transaction in transaction_list:
        if search_for_taken(transaction, MARK_2):
            if transaction_list.index(transaction) == 0:
                print('Первая транзакция в логе')
                print('Индекс TAKEN', transaction_list.index(transaction))
                print('Индекс следующей за TAKEN транзакции', transaction_list.index(transaction) + 1)
                print('\n')
                list1 = ['Первая транзакция в логе', '\n']
                list2 = transaction_list[transaction_list.index(transaction)]
                list3 = transaction_list[transaction_list.index(transaction) + 1]
                file_number = transaction_list.index(transaction)
                write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL)
            elif transaction_list.index(transaction) == (len(transaction_list) - 1):
                print('Индекс преведущей до TAKEN транзакции', transaction_list.index(transaction) - 1)
                print('Индекс TAKEN', transaction_list.index(transaction))
                print('Последняя транзакция в логе')
                print('\n')
                list1 = transaction_list[transaction_list.index(transaction) - 1]
                list2 = transaction_list[transaction_list.index(transaction)]
                list3 = ['Последняя транзакция в логе', '\n']
                file_number = transaction_list.index(transaction)
                write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL)
            else:
                print('Индекс преведущей до TAKEN транзакции', transaction_list.index(transaction) - 1)
                print('Индекс TAKEN', transaction_list.index(transaction))
                print('Индекс следующей за TAKEN транзакции', transaction_list.index(transaction) + 1)
                print('\n')
                list1 = transaction_list[transaction_list.index(transaction) - 1]
                list2 = transaction_list[transaction_list.index(transaction)]
                list3 = transaction_list[transaction_list.index(transaction) + 1]
                file_number = transaction_list.index(transaction)
                write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL)


def sort_transaction(transaction_list):
    success_transaction = list()
    failed_transaction = list()
    neutral_transaction = list()
    for transaction in transaction_list:
        if len(transaction) > BROCKEN_BLOCK_LENGTH:
            if search_for_taken(transaction, MARK_2):
                success_transaction.append(transaction)
#    leftover = transaction_list - success_transaction
    leftover = [item for item in transaction_list if item not in success_transaction if len(item) > BROCKEN_BLOCK_LENGTH]
    for transaction in leftover:
        if len(transaction) > BROCKEN_BLOCK_LENGTH:
            if search_for_failed(transaction, MARK_FAILED):
                failed_transaction.append(transaction)
    neutral_transaction = [item for item in leftover if item not in failed_transaction]
    return success_transaction, failed_transaction, neutral_transaction


def build_files(transaction_list, succesful, FILE_PATH_SUCCESFUL, SUCCESFUL_STATUS):
    for transaction in succesful:
        if transaction_list.index(transaction) == 0:
            list1 = ['Первая транзакция в логе', '\n']
            list2 = transaction_list[transaction_list.index(transaction)]
            list3 = transaction_list[transaction_list.index(transaction) + 1]
#            file_number = transaction_list.index(transaction)
            file_number = file_name(list2, SUCCESFUL_STATUS) + str(transaction_list.index(transaction))
            write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL, SUCCESFUL_STATUS)
        elif transaction_list.index(transaction) == (len(transaction_list) - 1):
            list1 = transaction_list[transaction_list.index(transaction) - 1]
            list2 = transaction_list[transaction_list.index(transaction)]
            list3 = ['Последняя транзакция в логе', '\n']
#            file_number = transaction_list.index(transaction)
            file_number = file_name(list2, SUCCESFUL_STATUS) + str(transaction_list.index(transaction))
            write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL, SUCCESFUL_STATUS)
        else:
            list1 = transaction_list[transaction_list.index(transaction) - 1]
            list2 = transaction_list[transaction_list.index(transaction)]
            list3 = transaction_list[transaction_list.index(transaction) + 1]
#            file_number = transaction_list.index(transaction)
            file_number = file_name(list2, SUCCESFUL_STATUS) + str(transaction_list.index(transaction))
            write_to_file(list1, list2, list3, file_number, FILE_PATH_SUCCESFUL, SUCCESFUL_STATUS)


def create_report(succesful, neutral, failed, FILE_PATH_REPORT, REPORT):
    
    for transaction in succesful:
        temp_dict = prepare_legend(transaction, SUCCESFUL_STATUS)
        REPORT.append(
                [temp_dict['SEQ Number'], 
                temp_dict['Tran date'],
                temp_dict['Tran time'],
                temp_dict['ATM'],
                temp_dict['Amount'],
                temp_dict['Currency'],
                temp_dict['Card'],
                temp_dict['Auth code'],
                temp_dict['Result']
                  ])
    for transaction in neutral:
        temp_dict = prepare_legend(transaction, NEUTRAL_STATUS)
        REPORT.append(
                [temp_dict['SEQ Number'], 
                temp_dict['Tran date'],
                temp_dict['Tran time'],
                temp_dict['ATM'],
                temp_dict['Amount'],
                temp_dict['Currency'],
                temp_dict['Card'],
                temp_dict['Auth code'],
                temp_dict['Result']
                  ])
    for transaction in failed:
        temp_dict = prepare_legend(transaction, FAILED_STATUS)
        REPORT.append(
                [temp_dict['SEQ Number'], 
                temp_dict['Tran date'],
                temp_dict['Tran time'],
                temp_dict['ATM'],
                temp_dict['Amount'],
                temp_dict['Currency'],
                temp_dict['Card'],
                temp_dict['Auth code'],
                temp_dict['Result']
                  ])
    return REPORT


def write_report_to_disk(FILE_PATH_REPORT, REPORT):
    with open(FILE_PATH_REPORT + 'Log_report.csv', 'w', encoding='utf8', newline='') as csv_file:
        csv_writer = csv.writer(csv_file, dialect='excel', quoting=csv.QUOTE_ALL)
        for line in REPORT:
            csv_writer.writerow(line)
    pass


if __name__ == "__main__":
    transaction_list = separate_transaction(FILE_PATH, FILE_NAME, MARK_0, MARK_1)
    transaction_list = clean_first_raws(transaction_list)
    transaction_list = clean_midle_raws(transaction_list)
    transaction_list = clean_midle_raws(transaction_list)
    transaction_list = clean_midle_raws(transaction_list)
#    build_files_with_taken(transaction_list)
    succesful, failed, neutral = sort_transaction(transaction_list)
    build_files(transaction_list, succesful, FILE_PATH_SUCCESFUL, SUCCESFUL_STATUS)
    build_files(transaction_list, neutral, FILE_PATH_NEUTRAL, NEUTRAL_STATUS)
    build_files(transaction_list, failed, FILE_PATH_FAILED, FAILED_STATUS)
    REPORT = create_report(succesful, neutral, failed, FILE_PATH_REPORT, REPORT)
    write_report_to_disk(FILE_PATH_REPORT, REPORT)