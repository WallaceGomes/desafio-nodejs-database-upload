// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({ title, type, value }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type invalid');
    }
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new Error('Not Able to create a new transaction');
    }

    const transaction = transactionsRepository.save({
      title,
      value,
      type,
    });

    // falta checar a category

    return transaction;
  }
}

export default CreateTransactionService;
