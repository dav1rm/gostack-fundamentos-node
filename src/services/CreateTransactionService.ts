import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const balance = this.transactionsRepository.getBalance();

    // Validations
    if (value <= 0) {
      throw Error('The value must be greater than 0');
    }

    if (type !== 'income' && type !== 'outcome') {
      throw Error("The type must be 'income' or 'outcome'");
    }

    if (type === 'outcome' && balance.total < value) {
      throw Error('Your balance is insufficient to withdraw');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
