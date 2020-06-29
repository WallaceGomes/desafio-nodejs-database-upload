import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type invalid');
    }
    const {
      total,
      // income,
      // outcome,
    } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('Not Able to create a new transaction', 400);
    }

    // balance: {
    //   income,
    //   outcome,
    //   total,
    // },

    const transaction = await transactionsRepository.save({
      title,
      value,
      type,
    });

    // falta checar a category

    return transaction;
  }
}

export default CreateTransactionService;
